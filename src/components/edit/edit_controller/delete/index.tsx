import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { closeModal, updateDeleteFlag } from '../../actions';
import { Theme, createStyles, WithStyles, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { deleteRule, deleteCurrent } from '../../../system/actions';
import { Delete as DeleteIcon } from '@material-ui/icons';

const styles = (theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
        },
    });

interface DispatchProps {
    closeModal: typeof closeModal;
    deleteRule: typeof deleteRule;
    deleteCurrent: typeof deleteCurrent;
    updateDeleteFlag: typeof updateDeleteFlag;
}

interface StateProps {
    deleteFlag: boolean;
    targetId?: string;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class EditDeleteInner extends React.Component<Props> {
    private delete = () => {
        const { targetId } = this.props;
        this.props.deleteRule(targetId);
        this.props.deleteCurrent(targetId);
        this.props.closeModal();
    };

    private toggleDeleteFlag = () => {
        const { deleteFlag } = this.props;
        this.props.updateDeleteFlag(!deleteFlag);
    };

    public render() {
        const { deleteFlag, classes } = this.props;
        return (
            <>
                <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    className={classes.button}
                    onClick={this.delete}
                    disabled={!deleteFlag}
                >
                    <DeleteIcon />
                    Delete
                </Button>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={deleteFlag}
                            onChange={this.toggleDeleteFlag}
                            value={deleteFlag}
                            icon={<DeleteIcon />}
                            checkedIcon={<DeleteIcon color="secondary" />}
                        />
                    }
                    label=""
                />
            </>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    deleteFlag: state.edit.deleteFlag,
    targetId: state.edit.targetId,
});

export const EditDelete = connect<StateProps, DispatchProps>(
    mapStateToProps,
    {
        closeModal,
        deleteRule,
        deleteCurrent,
        updateDeleteFlag,
    },
)(withStyles(styles)(EditDeleteInner));
