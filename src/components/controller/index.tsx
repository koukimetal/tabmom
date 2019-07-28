import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'components/store';
import { openModal } from '../edit/editModal';
import { Theme, createStyles, WithStyles, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = (theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
        },
    });

interface Props extends WithStyles<typeof styles> {
    openModal: typeof openModal;
}

class ControllerInner extends React.Component<Props> {
    private open = () => {
        this.props.openModal();
    };

    public render() {
        const { classes } = this.props;

        return (
            <Button variant="contained" color="primary" className={classes.button} onClick={this.open}>
                Open
            </Button>
        );
    }
}

const mapStateToProps = (state: AppState) => ({});

export const Controller = connect(
    mapStateToProps,
    { openModal },
)(withStyles(styles)(ControllerInner));
