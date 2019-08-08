import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'components/store';
import {
    EditModalState,
    updatePeriod,
    ModalMode,
    updateStartTime,
    updateEndTime,
    updateCurrent as editUpdateCurrent,
} from './actions';
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
    updatePeriod: typeof updatePeriod;
    editUpdateCurrent: typeof editUpdateCurrent;
    updateStartTime: typeof updateStartTime;
    updateEndTime: typeof updateEndTime;
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

    public render() {
        const { edit, classes } = this.props;
        return (
            <>
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
                        value={edit.period}
                        onChange={this.changePeriod}
                        margin="normal"
                    />
                </div>
                <div>
                    <TextField
                        label="StartTime"
                        className={classes.textField}
                        value={edit.startTime}
                        onChange={this.changeStartTime}
                        type="time"
                        margin="normal"
                    />
                    <TextField
                        label="EndTime"
                        className={classes.textField}
                        value={edit.endTime}
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
    edit: state.edit,
});

export const EditModalPeriod = connect<StateProps, DispatchProps>(
    mapStateToProps,
    {
        updatePeriod,
        editUpdateCurrent,
        updateStartTime,
        updateEndTime,
    },
)(withStyles(styles)(EditModalPeriodInner));
