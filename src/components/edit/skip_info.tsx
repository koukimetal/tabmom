import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'components/store';
import { EditModalState, updateIsSkipInfoActive, updateSkipInfoIgnorePinned, updateSkipInfoMatch } from './actions';
import { TextField, Theme, createStyles, WithStyles, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';

const styles = (theme: Theme) =>
    createStyles({
        fullTextField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
    });

interface DispatchProps {
    updateIsSkipInfoActive: typeof updateIsSkipInfoActive;
    updateSkipInfoIgnorePinned: typeof updateSkipInfoIgnorePinned;
    updateSkipInfoMatch: typeof updateSkipInfoMatch;
}

interface StateProps {
    edit: EditModalState;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class EditSkipInfoInner extends React.Component<Props> {
    private toggleIsSkipInfoActive = () => {
        const { edit } = this.props;
        this.props.updateIsSkipInfoActive(!edit.isSkipInfoActive);
    };

    private toggleIgnorePinned = () => {
        const { edit } = this.props;
        this.props.updateSkipInfoIgnorePinned(!edit.skipInfo.ignorePinned);
    };

    private changeSkipInfoMatch = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updateSkipInfoMatch(event.currentTarget.value);
    };

    public render() {
        const { edit, classes } = this.props;
        return (
            <>
                <div>
                    <FormGroup row>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={edit.isSkipInfoActive}
                                    onChange={this.toggleIsSkipInfoActive}
                                    value={edit.isSkipInfoActive}
                                />
                            }
                            label="UseSkipInfo"
                        />
                        {edit.isSkipInfoActive && (
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={edit.skipInfo.ignorePinned}
                                        onChange={this.toggleIgnorePinned}
                                        value={edit.skipInfo.ignorePinned}
                                    />
                                }
                                label="Ignore pinned tabs"
                            />
                        )}
                    </FormGroup>
                </div>

                {edit.isSkipInfoActive && (
                    <div>
                        <TextField
                            label="Skip openning if there is a tab whose URL includes this"
                            className={classes.fullTextField}
                            value={edit.skipInfo.match}
                            onChange={this.changeSkipInfoMatch}
                            margin="normal"
                            fullWidth
                        />
                    </div>
                )}
            </>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    edit: state.edit,
});

export const EditSkipInfo = connect<StateProps, DispatchProps>(
    mapStateToProps,
    {
        updateIsSkipInfoActive,
        updateSkipInfoIgnorePinned,
        updateSkipInfoMatch,
    },
)(withStyles(styles)(EditSkipInfoInner));
