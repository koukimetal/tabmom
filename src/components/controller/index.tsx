import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'components/store';
import { openModal } from '../edit/actions';
import { Theme, createStyles, WithStyles, Button, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Create as CreateIcon } from '@material-ui/icons';
const styles = (theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
        },
        root: {
            display: 'flex',
        },
        counter: {
            alignSelf: 'flex-end',
        },
    });

interface DispatchProps {
    openModal: typeof openModal;
}

interface StateProps {
    counter: number;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class ControllerInner extends React.Component<Props> {
    private open = () => {
        this.props.openModal();
    };

    public render() {
        const { classes, counter } = this.props;

        return (
            <div className={classes.root}>
                <div>
                    <Button variant="contained" color="primary" className={classes.button} onClick={this.open}>
                        <CreateIcon />
                        CREATE
                    </Button>
                </div>
                <div className={classes.counter}>
                    <Typography variant="subtitle1" gutterBottom>
                        Counter: {counter}
                    </Typography>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    counter: state.controller.counter,
});

export const Controller = connect(
    mapStateToProps,
    { openModal },
)(withStyles(styles)(ControllerInner));
