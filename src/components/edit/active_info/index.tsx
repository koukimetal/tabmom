import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { updateActive, updateOneTime, updateIsWeekSettingActive } from '../actions';
import { createStyles, WithStyles, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { WeekSetting } from './week_setting';

const styles = () => createStyles({});

interface DispatchProps {
    updateActive: typeof updateActive;
    updateOneTime: typeof updateOneTime;
    updateIsWeekSettingActive: typeof updateIsWeekSettingActive;
}

interface StateProps {
    active: boolean;
    oneTime: boolean;
    isWeekSettingActive: boolean;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class ActiveInfoInner extends React.Component<Props> {
    private toggleActive = () => {
        this.props.updateActive(!this.props.active);
    };
    private toggleOneTime = () => {
        this.props.updateOneTime(!this.props.oneTime);
    };

    private toggleWeekSettingActive = () => {
        this.props.updateIsWeekSettingActive(!this.props.isWeekSettingActive);
    };

    public render() {
        const { active, isWeekSettingActive, oneTime } = this.props;
        return (
            <>
                <div>
                    <FormGroup row>
                        <FormControlLabel
                            control={<Checkbox checked={active} onChange={this.toggleActive} value={active} />}
                            label="Active"
                        />
                        <FormControlLabel
                            control={<Checkbox checked={oneTime} onChange={this.toggleOneTime} value={oneTime} />}
                            label="OneTime"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={isWeekSettingActive}
                                    onChange={this.toggleWeekSettingActive}
                                    value={isWeekSettingActive}
                                />
                            }
                            label="UseWeekSetting"
                        />
                    </FormGroup>
                </div>
                {isWeekSettingActive && <WeekSetting />}
            </>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    active: state.edit.active,
    oneTime: state.edit.oneTime,
    isWeekSettingActive: state.edit.isWeekSettingActive,
});

export const ActiveInfo = connect<StateProps, DispatchProps>(
    mapStateToProps,
    {
        updateActive,
        updateOneTime,
        updateIsWeekSettingActive,
    },
)(withStyles(styles)(ActiveInfoInner));
