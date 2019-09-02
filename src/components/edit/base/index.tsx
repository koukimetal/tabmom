import * as React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/styles';
import { closeModal } from '../actions';
import { createStyles, WithStyles } from '@material-ui/core';
import { UrlForm } from './url';
import { NameForm } from './name';
import { Close as CloseIcon } from '@material-ui/icons';

const styles = () =>
    createStyles({
        top: {
            display: 'flex',
        },
        close: {
            marginLeft: 'auto',
        },
    });

interface DispatchProps {
    closeModal: typeof closeModal;
}

interface Props extends DispatchProps, WithStyles<typeof styles> {}

class UrlFormInner extends React.Component<Props> {
    private close = () => {
        this.props.closeModal();
    };
    public render() {
        const { classes } = this.props;
        return (
            <>
                <div className={classes.top}>
                    <NameForm />
                    <div className={classes.close}>
                        <CloseIcon onClick={this.close} />
                    </div>
                </div>
                <UrlForm />
            </>
        );
    }
}

export const BaseForm = connect<null, DispatchProps>(
    null,
    {
        closeModal,
    },
)(withStyles(styles)(UrlFormInner));
