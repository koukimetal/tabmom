import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'components/store';
import { EditModalState, updateName, saveRule, cancelModal } from './editModal';
import Modal from '@material-ui/core/Modal';
import { TextField, Theme, createStyles, WithStyles, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

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

interface Props extends WithStyles<typeof styles> {
    edit: EditModalState;
    updateName: typeof updateName;
    saveRule: typeof saveRule;
    cancelModal: typeof cancelModal;
}

class EditModalInner extends React.Component<Props> {
    private changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updateName(event.currentTarget.value);
    };

    private save = () => {
        this.props.saveRule();
    };
    private close = () => {
        this.props.cancelModal();
    };

    public render() {
        const { edit, classes } = this.props;

        return (
            <Modal open={edit.open} onClose={this.close}>
                <>
                    <TextField
                        label="Name"
                        className={classes.textField}
                        value={edit.name}
                        onChange={this.changeName}
                        margin="normal"
                    />
                    <Button variant="contained" color="primary" className={classes.button} onClick={this.save}>
                        Save
                    </Button>
                </>
            </Modal>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    edit: state.edit,
});

export const EditModal = connect(
    mapStateToProps,
    { updateName, saveRule, cancelModal },
)(withStyles(styles)(EditModalInner));
