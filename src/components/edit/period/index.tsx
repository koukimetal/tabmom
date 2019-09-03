import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { updateTimeRangeType } from '../actions';
import { createStyles, WithStyles, Select, Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { TimeRangeType } from '../../system/actions';
import { OnceADay } from './once';
import { ManyPeriod } from './many';
import { AllPeriod } from './all';

const styles = () =>
    createStyles({
        typeOptions: {
            marginLeft: 5,
        },
        modeText: {
            marginRight: 5,
        },
    });

interface DispatchProps {
    updateTimeRangeType: typeof updateTimeRangeType;
}

interface StateProps {
    type: TimeRangeType;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class EditModalPeriodInner extends React.Component<Props> {
    private changeClockConfigType = (event: React.ChangeEvent<HTMLInputElement>) => {
        const key = event.currentTarget.value as keyof typeof TimeRangeType;
        this.props.updateTimeRangeType(TimeRangeType[key]);
    };

    public render() {
        const { type, classes } = this.props;
        return (
            <>
                <div className={classes.typeOptions}>
                    <Typography variant="subtitle1" component="span" className={classes.modeText}>
                        Mode for a day:
                    </Typography>
                    <Select
                        native
                        value={type}
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
                {type === TimeRangeType.ONCE && <OnceADay />}
                {type === TimeRangeType.ALL && <AllPeriod />}
                {type === TimeRangeType.MANY && <ManyPeriod />}
            </>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    type: state.edit.clockConfig.type,
});

export const EditModalPeriod = connect<StateProps, DispatchProps>(
    mapStateToProps,
    {
        updateTimeRangeType,
    },
)(withStyles(styles)(EditModalPeriodInner));
