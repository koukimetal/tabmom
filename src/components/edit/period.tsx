import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../store';
import {
    EditModalState,
    updatePeriod,
    ModalMode,
    updateStartTime,
    updateEndTime,
    updateCurrent as editUpdateCurrent,
    updateTimeRangeType,
} from './actions';
import { TextField, Theme, createStyles, WithStyles, Select } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { TimeRangeType } from '../system/actions';

const styles = (theme: Theme) =>
    createStyles({
        textField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
            width: 200,
        },
        typeOptions: {
            marginLeft: 5,
        },
    });

interface DispatchProps {
    updatePeriod: typeof updatePeriod;
    editUpdateCurrent: typeof editUpdateCurrent;
    updateStartTime: typeof updateStartTime;
    updateEndTime: typeof updateEndTime;
    updateTimeRangeType: typeof updateTimeRangeType;
}

interface StateProps {
    edit: EditModalState;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class EditModalPeriodInner extends React.Component<Props> {
    private changePeriod = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updatePeriod(event.currentTarget.value);
    };
    private changeCurrent = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.editUpdateCurrent(event.currentTarget.value);
    };

    private changeStartTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updateStartTime(event.currentTarget.value);
    };
    private changeEndTime = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updateEndTime(event.currentTarget.value);
    };
    private changeClockConfigType = (event: React.ChangeEvent<HTMLInputElement>) => {
        const key = event.currentTarget.value as keyof typeof TimeRangeType;
        this.props.updateTimeRangeType(TimeRangeType[key]);
    };

    private renderForOnceADay = () => {
        const { edit, classes } = this.props;

        return (
            <div>
                <TextField
                    label="TimeToTrigger"
                    className={classes.textField}
                    value={edit.clockConfig.startTime}
                    onChange={this.changeStartTime}
                    type="time"
                    margin="normal"
                />
            </div>
        );
    };

    private renderForALL = () => {
        const { edit, classes } = this.props;
        return (
            <div>
                {edit.mode === ModalMode.EDIT && (
                    <TextField
                        label="Current"
                        className={classes.textField}
                        value={edit.current}
                        onChange={this.changeCurrent}
                        margin="normal"
                    />
                )}
                <TextField
                    label="Period"
                    className={classes.textField}
                    value={edit.clockConfig.period}
                    onChange={this.changePeriod}
                    margin="normal"
                />
            </div>
        );
    };

    private renderForMany = () => {
        const { edit, classes } = this.props;
        return (
            <>
                {this.renderForALL()}
                <div>
                    <TextField
                        label="StartTime"
                        className={classes.textField}
                        value={edit.clockConfig.startTime}
                        onChange={this.changeStartTime}
                        type="time"
                        margin="normal"
                    />
                    <TextField
                        label="EndTime"
                        className={classes.textField}
                        value={edit.clockConfig.endTime}
                        type="time"
                        onChange={this.changeEndTime}
                        margin="normal"
                    />
                </div>
            </>
        );
    };

    public render() {
        const { edit, classes } = this.props;
        return (
            <>
                <div className={classes.typeOptions}>
                    <Select
                        native
                        value={edit.clockConfig.type}
                        onChange={this.changeClockConfigType}
                        inputProps={{
                            name: 'RangeType',
                        }}
                    >
                        <option value={TimeRangeType.ALL.toString()}>All</option>
                        <option value={TimeRangeType.MANY.toString()}>Many</option>
                        <option value={TimeRangeType.ONCE.toString()}>Once</option>
                    </Select>
                </div>
                {edit.clockConfig.type === TimeRangeType.ONCE && this.renderForOnceADay()}
                {edit.clockConfig.type === TimeRangeType.ALL && this.renderForALL()}
                {edit.clockConfig.type === TimeRangeType.MANY && this.renderForMany()}
            </>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    edit: state.edit,
});

export const EditModalPeriod = connect<StateProps, DispatchProps>(
    mapStateToProps,
    {
        updatePeriod,
        editUpdateCurrent,
        updateStartTime,
        updateEndTime,
        updateTimeRangeType,
    },
)(withStyles(styles)(EditModalPeriodInner));
