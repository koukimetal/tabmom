import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import {
    EditModalState,
    closeModal,
    updateActive,
    ModalMode,
    updateOneTime,
    updateDeleteFlag,
    updateIsWeekSettingActive,
    updateWeekSetting,
} from '../actions';
import { Theme, createStyles, WithStyles, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import {
    CronRule,
    addRule,
    updateRule,
    deleteRule,
    deleteCurrent,
    updateCurrent as systemUpdateCurrent,
    TimeRangeType,
    ClockConfig,
    isNeedPeriod,
} from '../../system/actions';
import { Save as SaveIcon, Delete as DeleteIcon, FileCopy as CopyIcon } from '@material-ui/icons';
import * as uuidV1 from 'uuid/v1';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1),
        },
        button: {
            margin: theme.spacing(1),
        },
    });

interface DispatchProps {
    closeModal: typeof closeModal;
    updateActive: typeof updateActive;
    addRule: typeof addRule;
    updateRule: typeof updateRule;
    deleteRule: typeof deleteRule;
    deleteCurrent: typeof deleteCurrent;
    updateDeleteFlag: typeof updateDeleteFlag;
    systemUpdateCurrent: typeof systemUpdateCurrent;
    updateOneTime: typeof updateOneTime;
    updateIsWeekSettingActive: typeof updateIsWeekSettingActive;
    updateWeekSetting: typeof updateWeekSetting;
}

interface StateProps {
    edit: EditModalState;
    validInput: boolean;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

const isValidTime = (time: string) => {
    const [sHour, sMin] = time.split(':');
    if (!sHour || !sMin) {
        return false;
    }
    const hour = parseInt(sHour);
    const min = parseInt(sMin);
    if (!Number.isInteger(hour) || !Number.isInteger(min)) {
        return false;
    }

    return 0 <= hour && hour < 24 && 0 <= min && min < 60;
};

class EditControllerInner extends React.Component<Props> {
    private convertTimeToNumber = (time: string) => {
        const [sHour, sMin] = time.split(':');
        const hour = parseInt(sHour);
        const min = parseInt(sMin);
        return hour * 60 + min;
    };

    private getClockConfig = () => {
        const { edit } = this.props;

        let clockConfig: ClockConfig;

        if (edit.clockConfig.type === TimeRangeType.ALL) {
            clockConfig = {
                type: edit.clockConfig.type,
                period: parseInt(edit.clockConfig.period),
            };
        } else if (edit.clockConfig.type === TimeRangeType.ONCE) {
            clockConfig = {
                type: edit.clockConfig.type,
                startTime: this.convertTimeToNumber(edit.clockConfig.startTime),
            };
        } else if (edit.clockConfig.type === TimeRangeType.MANY) {
            clockConfig = {
                type: edit.clockConfig.type,
                period: parseInt(edit.clockConfig.period),
                startTime: this.convertTimeToNumber(edit.clockConfig.startTime),
                endTime: this.convertTimeToNumber(edit.clockConfig.endTime),
            };
        }

        return clockConfig;
    };

    private getRule = (id: string) => {
        const { edit } = this.props;
        const clockConfig = this.getClockConfig();
        let rule: CronRule = {
            id,
            name: edit.name,
            active: edit.active,
            url: edit.url,
            oneTime: edit.oneTime,
            clockConfig,
        };

        if (edit.isSkipInfoActive) {
            rule = Object.assign({}, rule, { skipInfo: { ...edit.skipInfo } });
        }

        if (edit.isWeekSettingActive) {
            rule = Object.assign({}, rule, { weekSetting: [...edit.weekSetting] });
        }

        return rule;
    };

    private saveInner = (copy = false) => {
        const { edit } = this.props;

        const createNew = edit.targetId === null || copy;
        const id = createNew ? uuidV1() : edit.targetId;

        const rule = this.getRule(id);

        if (createNew) {
            if (isNeedPeriod(rule.clockConfig)) {
                this.props.systemUpdateCurrent(id, rule.clockConfig.period);
            }
            this.props.addRule(rule);
        } else {
            if (isNeedPeriod(rule.clockConfig)) {
                const currentNum = parseInt(edit.current);
                this.props.systemUpdateCurrent(id, currentNum);
            } else {
                this.props.deleteCurrent(id);
            }
            this.props.updateRule(rule);
        }
        this.props.closeModal();
    };

    private save = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        this.saveInner();
    };

    private copy = () => {
        this.saveInner(true);
    };

    private delete = () => {
        const { edit } = this.props;
        this.props.deleteRule(edit.targetId);
        this.props.deleteCurrent(edit.targetId);
        this.props.closeModal();
    };

    private toggleDeleteFlag = () => {
        const { edit } = this.props;
        this.props.updateDeleteFlag(!edit.deleteFlag);
    };

    public render() {
        const { edit, classes, validInput } = this.props;
        return (
            <form onSubmit={this.save}>
                {this.props.children}
                <div>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.button}
                        type="submit"
                        disabled={!validInput}
                    >
                        <SaveIcon />
                        Save
                    </Button>
                    {edit.mode === ModalMode.EDIT && (
                        <>
                            <Button
                                variant="contained"
                                color="secondary"
                                type="button"
                                className={classes.button}
                                onClick={this.delete}
                                disabled={!edit.deleteFlag}
                            >
                                <DeleteIcon />
                                Delete
                            </Button>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={edit.deleteFlag}
                                        onChange={this.toggleDeleteFlag}
                                        value={edit.deleteFlag}
                                        icon={<DeleteIcon />}
                                        checkedIcon={<DeleteIcon color="secondary" />}
                                    />
                                }
                                label=""
                            />
                            <Button
                                variant="outlined"
                                color="primary"
                                className={classes.button}
                                disabled={!validInput}
                                onClick={this.copy}
                            >
                                <CopyIcon />
                                Copy
                            </Button>
                        </>
                    )}
                </div>
            </form>
        );
    }
}

const validator = (editState: EditModalState) => {
    let verifyPeriod = false;
    if (editState.clockConfig.type === TimeRangeType.ONCE) {
        verifyPeriod = true;
    } else {
        // ALL or ANY
        const period = parseInt(editState.clockConfig.period);
        verifyPeriod = Number.isInteger(period) && period > 0;
    }

    let verifyCurrent = false;
    if (editState.clockConfig.type === TimeRangeType.ONCE) {
        verifyCurrent = true;
    } else {
        // ALL or ANY
        if (editState.mode === ModalMode.CREATE) {
            verifyCurrent = true;
        } else {
            const current = parseInt(editState.current);
            verifyCurrent = Number.isInteger(current) && current > 0;
        }
    }

    let verifyStartTime = false;
    if (editState.clockConfig.type === TimeRangeType.ALL) {
        verifyStartTime = true;
    } else {
        // MANY, ONCE
        verifyStartTime = isValidTime(editState.clockConfig.startTime);
    }

    let verifyEndTime = false;
    if (editState.clockConfig.type === TimeRangeType.ALL || editState.clockConfig.type === TimeRangeType.ONCE) {
        verifyEndTime = true;
    } else {
        // MANY
        verifyEndTime = isValidTime(editState.clockConfig.endTime);
    }

    return verifyPeriod && verifyCurrent && verifyStartTime && verifyEndTime;
};

const mapStateToProps = (state: AppState) => ({
    edit: state.edit,
    validInput: validator(state.edit),
});

export const EditController = connect<StateProps, DispatchProps>(
    mapStateToProps,
    {
        closeModal,
        updateActive,
        addRule,
        deleteRule,
        updateRule,
        deleteCurrent,
        updateDeleteFlag,
        systemUpdateCurrent,
        updateOneTime,
        updateIsWeekSettingActive,
        updateWeekSetting,
    },
)(withStyles(styles)(EditControllerInner));
