import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'components/store';
import {
    EditModalState,
    updateName,
    closeModal,
    updatePeriod,
    updateUrl,
    updateActive,
    ModalMode,
    updateOneTime,
    updateDeleteFlag,
    updateStartTime,
    updateEndTime,
    updateCurrent as editUpdateCurrent,
} from './actions';
import Modal from '@material-ui/core/Modal';
import {
    TextField,
    Theme,
    createStyles,
    WithStyles,
    Button,
    Paper,
    FormGroup,
    FormControlLabel,
    Checkbox,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import {
    CronRule,
    addRule,
    updateRule,
    deleteRule,
    deleteCurrent,
    updateCurrent as systemUpdateCurrent,
} from '../system/actions';
import { Save as SaveIcon, Delete as DeleteIcon } from '@material-ui/icons';
import * as uuidV1 from 'uuid/v1';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1),
        },
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 200,
        },
        fullTextField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
        button: {
            margin: theme.spacing(1),
        },
    });

interface DispatchProps {
    updateName: typeof updateName;
    closeModal: typeof closeModal;
    updatePeriod: typeof updatePeriod;
    updateUrl: typeof updateUrl;
    updateActive: typeof updateActive;
    addRule: typeof addRule;
    updateRule: typeof updateRule;
    deleteRule: typeof deleteRule;
    deleteCurrent: typeof deleteCurrent;
    updateDeleteFlag: typeof updateDeleteFlag;
    systemUpdateCurrent: typeof systemUpdateCurrent;
    editUpdateCurrent: typeof editUpdateCurrent;
    updateOneTime: typeof updateOneTime;
    updateStartTime: typeof updateStartTime;
    updateEndTime: typeof updateEndTime;
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

class EditModalInner extends React.Component<Props> {
    private changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updateName(event.currentTarget.value);
    };
    private changePeriod = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updatePeriod(event.currentTarget.value);
    };
    private changeCurrent = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.editUpdateCurrent(event.currentTarget.value);
    };
    private changeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updateUrl(event.currentTarget.value);
    };
    private toggleActive = () => {
        this.props.updateActive(!this.props.edit.active);
    };
    private toggleOneTime = () => {
        this.props.updateOneTime(!this.props.edit.oneTime);
    };
    private changeStartTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updateStartTime(event.currentTarget.value);
    };
    private changeEndTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updateEndTime(event.currentTarget.value);
    };

    private convertTimeToNumber = (time: string) => {
        const [sHour, sMin] = time.split(':');
        const hour = parseInt(sHour);
        const min = parseInt(sMin);
        return hour * 60 + min;
    };

    private save = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const { edit } = this.props;
        const periodNum = parseInt(edit.period);
        const createNew = edit.targetId === null;

        const id = createNew ? uuidV1() : edit.targetId;
        const startTime = this.convertTimeToNumber(edit.startTime);
        const endTime = this.convertTimeToNumber(edit.endTime);
        const rule: CronRule = {
            id,
            name: edit.name,
            period: periodNum,
            active: edit.active,
            url: edit.url,
            oneTime: edit.oneTime,
            startTime,
            endTime,
        };

        if (createNew) {
            this.props.systemUpdateCurrent(id, periodNum);
            this.props.addRule(rule);
        } else {
            const currentNum = parseInt(edit.current);
            this.props.systemUpdateCurrent(id, currentNum);
            this.props.updateRule(rule);
        }
        this.props.closeModal();
    };

    private delete = () => {
        const { edit } = this.props;
        this.props.deleteRule(edit.targetId);
        this.props.deleteCurrent(edit.targetId);
        this.props.closeModal();
    };

    private close = () => {
        this.props.closeModal();
    };

    private toggleDeleteFlag = () => {
        const { edit } = this.props;
        this.props.updateDeleteFlag(!edit.deleteFlag);
    };

    public render() {
        const { edit, classes, validInput } = this.props;
        return (
            <Modal open={edit.mode !== ModalMode.CLOSED} onClose={this.close}>
                <>
                    <Paper className={classes.root}>
                        <form onSubmit={this.save}>
                            <div>
                                <TextField
                                    label="Name"
                                    className={classes.fullTextField}
                                    value={edit.name}
                                    onChange={this.changeName}
                                    margin="normal"
                                    fullWidth
                                />
                            </div>
                            <div>
                                {edit.mode === ModalMode.EDIT && (
                                    <TextField
                                        label="Current"
                                        className={classes.textField}
                                        value={edit.current}
                                        onChange={this.changeCurrent}
                                        margin="normal"
                                    />
                                )}
                                <TextField
                                    label="Period"
                                    className={classes.textField}
                                    value={edit.period}
                                    onChange={this.changePeriod}
                                    margin="normal"
                                />
                            </div>
                            <div>
                                <TextField
                                    label="URL"
                                    className={classes.fullTextField}
                                    value={edit.url}
                                    onChange={this.changeUrl}
                                    margin="normal"
                                    fullWidth
                                />
                            </div>
                            <div>
                                <TextField
                                    label="StartTime"
                                    className={classes.textField}
                                    value={edit.startTime}
                                    onChange={this.changeStartTime}
                                    type="time"
                                    margin="normal"
                                />
                                <TextField
                                    label="EndTime"
                                    className={classes.textField}
                                    value={edit.endTime}
                                    type="time"
                                    onChange={this.changeEndTime}
                                    margin="normal"
                                />
                            </div>
                            <div>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={edit.active}
                                                onChange={this.toggleActive}
                                                value={edit.active}
                                            />
                                        }
                                        label="Active"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={edit.oneTime}
                                                onChange={this.toggleOneTime}
                                                value={edit.oneTime}
                                            />
                                        }
                                        label="OneTime"
                                    />
                                </FormGroup>
                            </div>

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
                                    </>
                                )}
                            </div>
                        </form>
                    </Paper>
                </>
            </Modal>
        );
    }
}

const validator = (editState: EditModalState) => {
    if (!isValidTime(editState.startTime) || !isValidTime(editState.endTime)) {
        return false;
    }
    // FYI: parseInt("12a") is 12
    if (editState.mode === ModalMode.CREATE) {
        const period = parseInt(editState.period);
        return Number.isInteger(period) && period > 0;
    } else if (editState.mode === ModalMode.EDIT) {
        const period = parseInt(editState.period);
        const current = parseInt(editState.current);
        return Number.isInteger(period) && period > 0 && Number.isInteger(current) && current > 0;
    } else {
        return false;
    }
};

const mapStateToProps = (state: AppState) => ({
    edit: state.edit,
    validInput: validator(state.edit),
});

export const EditModal = connect<StateProps, DispatchProps>(
    mapStateToProps,
    {
        updateName,
        closeModal,
        updateUrl,
        updatePeriod,
        updateActive,
        addRule,
        deleteRule,
        updateRule,
        deleteCurrent,
        updateDeleteFlag,
        systemUpdateCurrent,
        updateStartTime,
        updateEndTime,
        editUpdateCurrent,
        updateOneTime,
    },
)(withStyles(styles)(EditModalInner));
