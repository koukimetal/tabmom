import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { updatePeriod, ModalMode, updateCurrent as editUpdateCurrent } from '../../actions';
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
}

interface StateProps {
    mode: ModalMode;
    period?: string;
    current?: string;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class AllPeriodInner extends React.Component<Props> {
    private changePeriod = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updatePeriod(event.currentTarget.value);
    };
    private changeCurrent = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.editUpdateCurrent(event.currentTarget.value);
    };

    public render() {
        const { mode, period, current, classes } = this.props;
        return (
            <div>
                {mode === ModalMode.EDIT && (
                    <TextField
                        label="Current"
                        className={classes.textField}
                        value={current}
                        onChange={this.changeCurrent}
                        margin="normal"
                    />
                )}
                <TextField
                    label="Period"
                    className={classes.textField}
                    value={period}
                    onChange={this.changePeriod}
                    margin="normal"
                />
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    mode: state.edit.mode,
    period: state.edit.clockConfig.period,
    current: state.edit.current,
});

export const AllPeriod = connect<StateProps, DispatchProps>(
    mapStateToProps,
    {
        updatePeriod,
        editUpdateCurrent,
    },
)(withStyles(styles)(AllPeriodInner));
