import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../store';
import { ModalMode } from '../actions';
import { createStyles, WithStyles } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { EditDelete } from './delete';
import { SaveButton, CopyButton } from './save';

const styles = () =>
    createStyles({
        root: {
            display: 'flex',
        },
    });

interface StateProps {
    mode: ModalMode;
}

interface Props extends StateProps, WithStyles<typeof styles> {}

class EditControllerInner extends React.Component<Props> {
    public render() {
        const { mode, classes } = this.props;
        return (
            <div className={classes.root}>
                <SaveButton />
                {mode === ModalMode.EDIT && (
                    <>
                        <EditDelete />
                        <CopyButton />
                    </>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    mode: state.edit.mode,
});

export const EditController = connect<StateProps, {}>(
    mapStateToProps,
    {},
)(withStyles(styles)(EditControllerInner));
