import * as React from 'react';
import { connect } from 'react-redux';
import { openModal } from '../edit/actions';
import { Theme, createStyles, WithStyles, Button } from '@material-ui/core';
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
    });

interface DispatchProps {
    openModal: typeof openModal;
}

interface Props extends DispatchProps, WithStyles<typeof styles> {}

class ControllerInner extends React.Component<Props> {
    private open = () => {
        this.props.openModal();
    };

    public render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <div>
                    <Button variant="contained" color="primary" className={classes.button} onClick={this.open}>
                        <CreateIcon />
                        CREATE
                    </Button>
                </div>
            </div>
        );
    }
}

const mapStateToProps = () => ({});

export const Controller = connect<{}, DispatchProps>(
    mapStateToProps,
    { openModal },
)(withStyles(styles)(ControllerInner));
