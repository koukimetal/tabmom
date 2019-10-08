import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { EditModalState, closeModal, ClockConfigEdit } from '../../actions';
import { Theme, createStyles, WithStyles, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import {
    CronRule,
    addRule,
    updateRule,
    deleteCurrent,
    updateCurrent as systemUpdateCurrent,
    TimeRangeType,
    ClockConfig,
    isNeedPeriod,
} from '../../../system/actions';
import { Save as SaveIcon, FileCopy as CopyIcon } from '@material-ui/icons';
import * as uuidV1 from 'uuid/v1';
import { isValidInput } from '../validator';

const styles = (theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
        },
    });

interface DispatchProps {
    closeModal: typeof closeModal;
    addRule: typeof addRule;
    updateRule: typeof updateRule;
    deleteCurrent: typeof deleteCurrent;
    systemUpdateCurrent: typeof systemUpdateCurrent;
}

interface StateProps {
    edit: EditModalState;
    validInput: boolean;
}

export interface SaveCopyBaseProps extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class SaveCopyBase extends React.Component<SaveCopyBaseProps> {
    public convertTimeToNumber = (time: string) => {
        const [sHour, sMin] = time.split(':');
        const hour = parseInt(sHour);
        const min = parseInt(sMin);
        return hour * 60 + min;
    };

    public getClockConfig = (clockConfigEdit: ClockConfigEdit): ClockConfig => {
        let clockConfig: ClockConfig;

        if (clockConfigEdit.type === TimeRangeType.ALL) {
            clockConfig = {
                type: clockConfigEdit.type,
                period: parseInt(clockConfigEdit.period),
            };
        } else if (clockConfigEdit.type === TimeRangeType.ONCE) {
            clockConfig = {
                type: clockConfigEdit.type,
                startTime: this.convertTimeToNumber(clockConfigEdit.startTime),
            };
        } else if (clockConfigEdit.type === TimeRangeType.MANY) {
            clockConfig = {
                type: clockConfigEdit.type,
                period: parseInt(clockConfigEdit.period),
                startTime: this.convertTimeToNumber(clockConfigEdit.startTime),
                endTime: this.convertTimeToNumber(clockConfigEdit.endTime),
            };
        }

        return clockConfig;
    };

    public getRule = (id: string) => {
        const { edit } = this.props;
        const clockConfig = this.getClockConfig(edit.clockConfig);
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

    public update = (targetId: string = null) => {
        const { edit } = this.props;

        const createNew = targetId === null;
        const id = createNew ? uuidV1() : targetId;

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
    };
}

export class SaveButtonInner extends SaveCopyBase {
    public save = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { edit } = this.props;
        this.update(edit.targetId);
        this.props.closeModal();
    };

    public render() {
        const { classes, validInput } = this.props;
        return (
            <div>
                <form onSubmit={this.save}>
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
                </form>
            </div>
        );
    }
}

export class CopyButtonInner extends SaveCopyBase {
    public copy = () => {
        this.update(null);
        this.props.closeModal();
    };

    public render() {
        const { classes, validInput } = this.props;
        return (
            <div>
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
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    edit: state.edit,
    validInput: isValidInput(state.edit),
});

const mapDispatchToProps: DispatchProps = {
    closeModal,
    addRule,
    updateRule,
    deleteCurrent,
    systemUpdateCurrent,
};

export const SaveButton = connect<StateProps, DispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(SaveButtonInner));

export const CopyButton = connect<StateProps, DispatchProps>(
    mapStateToProps,
    mapDispatchToProps,
)(withStyles(styles)(CopyButtonInner));
