import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../store';
import { closeModal, ModalMode } from './actions';
import Modal from '@material-ui/core/Modal';
import { Theme, createStyles, WithStyles, Paper } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { EditSkipInfo } from './skip_info';
import { EditModalPeriod } from './period';
import { BaseForm } from './base';
import { ActiveInfo } from './active_info';
import { EditController } from './edit_controller';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            padding: theme.spacing(1),
        },
    });

interface DispatchProps {
    closeModal: typeof closeModal;
}

interface StateProps {
    mode: ModalMode;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class EditModalInner extends React.Component<Props> {
    private close = () => {
        this.props.closeModal();
    };

    public render() {
        const { mode, classes } = this.props;
        return (
            <Modal open={mode !== ModalMode.CLOSED} onClose={this.close}>
                <>
                    <Paper className={classes.root}>
                        <BaseForm />
                        <EditModalPeriod />
                        <ActiveInfo />
                        <EditSkipInfo />
                        <EditController />
                    </Paper>
                </>
            </Modal>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    mode: state.edit.mode,
});

export const EditModal = connect<StateProps, DispatchProps>(
    mapStateToProps,
    {
        closeModal,
    },
)(withStyles(styles)(EditModalInner));
