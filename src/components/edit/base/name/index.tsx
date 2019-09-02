import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { withStyles } from '@material-ui/styles';
import { updateName } from '../../actions';
import { TextField, Theme, createStyles, WithStyles } from '@material-ui/core';

const styles = (theme: Theme) =>
    createStyles({
        fullTextField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
    });

interface DispatchProps {
    updateName: typeof updateName;
}

interface StateProps {
    name: string;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class NameFormInner extends React.Component<Props> {
    private changeName = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updateName(event.currentTarget.value);
    };
    public render() {
        const { name, classes } = this.props;
        // TODO fullWidth doesn't work with flex.
        return (
            <div>
                <TextField
                    label="Name"
                    className={classes.fullTextField}
                    value={name}
                    onChange={this.changeName}
                    margin="normal"
                    fullWidth
                />
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    name: state.edit.name,
});

export const NameForm = connect<StateProps, DispatchProps>(
    mapStateToProps,
    {
        updateName,
    },
)(withStyles(styles)(NameFormInner));
