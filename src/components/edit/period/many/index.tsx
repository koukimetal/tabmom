import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { updateStartTime, updateEndTime } from '../../actions';
import { TextField, Theme, createStyles, WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { AllPeriod } from '../all';

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
    updateEndTime: typeof updateEndTime;
}

interface StateProps {
    startTime?: string;
    endTime?: string;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class ManyPeriodInner extends React.Component<Props> {
    private changeStartTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updateStartTime(event.currentTarget.value);
    };
    private changeEndTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updateEndTime(event.currentTarget.value);
    };

    public render() {
        const { startTime, endTime, classes } = this.props;
        return (
            <>
                <AllPeriod />
                <div>
                    <TextField
                        label="StartTime"
                        className={classes.textField}
                        value={startTime}
                        onChange={this.changeStartTime}
                        type="time"
                        margin="normal"
                    />
                    <TextField
                        label="EndTime"
                        className={classes.textField}
                        value={endTime}
                        type="time"
                        onChange={this.changeEndTime}
                        margin="normal"
                    />
                </div>
            </>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    startTime: state.edit.clockConfig.startTime,
    endTime: state.edit.clockConfig.endTime,
});

export const ManyPeriod = connect<StateProps, DispatchProps>(
    mapStateToProps,
    {
        updateStartTime,
        updateEndTime,
    },
)(withStyles(styles)(ManyPeriodInner));
