import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../../store';
import { updateWeekSetting } from '../../../actions';
import { createStyles, WithStyles, FormControlLabel, Checkbox } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = () => createStyles({});

interface DispatchProps {
    updateWeekSetting: typeof updateWeekSetting;
}

interface OwnProps {
    day: number;
}

interface StateProps extends OwnProps {
    weekSetting: boolean[];
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

const DAY_TO_STRING: Readonly<string[]> = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

class ADayInner extends React.Component<Props> {
    private toggleAWeekSetting = (day: number) => {
        const { weekSetting } = this.props;
        this.props.updateWeekSetting(day, !weekSetting[day]);
    };

    public render() {
        const { weekSetting, day } = this.props;
        const checked = weekSetting[day];
        return (
            <FormControlLabel
                key={day}
                control={<Checkbox checked={checked} onChange={() => this.toggleAWeekSetting(day)} value={checked} />}
                label={DAY_TO_STRING[day]}
            />
        );
    }
}

const mapStateToProps = (state: AppState, own: OwnProps) => ({
    weekSetting: state.edit.weekSetting,
    day: own.day,
});

export const ADay = connect<StateProps, DispatchProps, OwnProps>(
    mapStateToProps,
    {
        updateWeekSetting,
    },
)(withStyles(styles)(ADayInner));
