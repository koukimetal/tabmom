import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { updateStartTime } from '../../actions';
import { TextField, Theme, createStyles, WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = (theme: Theme) =>
    createStyles({
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 200,
        },
    });

interface DispatchProps {
    updateStartTime: typeof updateStartTime;
}

interface StateProps {
    startTime?: string;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class OnceADayInner extends React.Component<Props> {
    private changeStartTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updateStartTime(event.currentTarget.value);
    };

    public render() {
        const { startTime, classes } = this.props;

        return (
            <div>
                <TextField
                    label="TimeToTrigger"
                    className={classes.textField}
                    value={startTime}
                    onChange={this.changeStartTime}
                    type="time"
                    margin="normal"
                />
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    startTime: state.edit.clockConfig.startTime,
});

export const OnceADay = connect<StateProps, DispatchProps>(
    mapStateToProps,
    {
        updateStartTime,
    },
)(withStyles(styles)(OnceADayInner));
