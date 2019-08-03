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
    updateDeleteFlag,
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
import { CronRule, addRule, updateRule, deleteRule } from '../table/actions';
import { Save as SaveIcon, Delete as DeleteIcon } from '@material-ui/icons';

const styles = (theme: Theme) =>
    createStyles({
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 200,
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
    updateDeleteFlag: typeof updateDeleteFlag;
}

interface StateProps {
    edit: EditModalState;
    validInput: boolean;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class EditModalInner extends React.Component<Props> {
    private changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updateName(event.currentTarget.value);
    };
    private changePeriod = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updatePeriod(event.currentTarget.value);
    };
    private changeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updateUrl(event.currentTarget.value);
    };
    private toggleActive = () => {
        this.props.updateActive(!this.props.edit.active);
    };

    private save = () => {
        const { edit } = this.props;
        const rule: CronRule = {
            name: edit.name,
            period: parseInt(edit.period),
            active: edit.active,
            url: edit.url,
        };
        if (edit.editIndex >= 0) {
            this.props.updateRule(rule, edit.editIndex);
        } else {
            this.props.addRule(rule);
        }
        this.props.closeModal();
    };

    private delete = () => {
        const { edit } = this.props;
        this.props.deleteRule(edit.editIndex);
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
                    <Paper>
                        <div>
                            <TextField
                                label="Name"
                                className={classes.textField}
                                value={edit.name}
                                onChange={this.changeName}
                                margin="normal"
                            />
                        </div>
                        <div>
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
                                className={classes.textField}
                                value={edit.url}
                                onChange={this.changeUrl}
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
                            </FormGroup>
                        </div>

                        <div>
                            <Button
                                variant="contained"
                                color="primary"
                                className={classes.button}
                                onClick={this.save}
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
                    </Paper>
                </>
            </Modal>
        );
    }
}

const validator = (editState: EditModalState) => {
    const period = parseInt(editState.period);
    return Number.isInteger(period) && period > 0;
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
        updateDeleteFlag,
    },
)(withStyles(styles)(EditModalInner));
