import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'components/store';
import { EditModalState, updateName, closeModal, updatePeriod, updateUrl, updateActive, updateRegex } from './actions';
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
import { CronRule, addRule } from '../table/actions';

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
    updateRegex: typeof updateRegex;
    addRule: typeof addRule;
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
    private toggleRegex = () => {
        this.props.updateRegex(!this.props.edit.regex);
    };

    private save = () => {
        const { edit } = this.props;
        const rule: CronRule = {
            name: edit.name,
            period: parseInt(edit.period),
            regex: edit.regex,
            active: edit.active,
            url: edit.url,
        };

        this.props.addRule(rule);
        this.props.closeModal();
    };
    private close = () => {
        this.props.closeModal();
    };

    public render() {
        const { edit, classes, validInput } = this.props;

        console.log(validInput);
        return (
            <Modal open={edit.open} onClose={this.close}>
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
                                <FormControlLabel
                                    control={
                                        <Checkbox checked={edit.regex} onChange={this.toggleRegex} value={edit.regex} />
                                    }
                                    label="Regex"
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
                                Save
                            </Button>
                        </div>
                    </Paper>
                </>
            </Modal>
        );
    }
}

const validator = (editState: EditModalState) => {
    console.log(Number.isInteger(parseInt(editState.period)));
    return Number.isInteger(parseInt(editState.period));
};

const mapStateToProps = (state: AppState) => ({
    edit: state.edit,
    validInput: validator(state.edit),
});

export const EditModal = connect<StateProps, DispatchProps>(
    mapStateToProps,
    { updateName, closeModal, updateUrl, updatePeriod, updateRegex, updateActive, addRule },
)(withStyles(styles)(EditModalInner));
