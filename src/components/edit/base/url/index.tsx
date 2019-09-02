import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from '../../../store';
import { withStyles } from '@material-ui/styles';
import { updateUrl } from '../../actions';
import { TextField, Theme, createStyles, WithStyles } from '@material-ui/core';

const styles = (theme: Theme) =>
    createStyles({
        fullTextField: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(1),
        },
    });

interface DispatchProps {
    updateUrl: typeof updateUrl;
}

interface StateProps {
    url: string;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class UrlFormInner extends React.Component<Props> {
    private changeUrl = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.updateUrl(event.currentTarget.value);
    };
    public render() {
        const { url, classes } = this.props;
        return (
            <>
                <div>
                    <TextField
                        label="URL"
                        className={classes.fullTextField}
                        value={url}
                        onChange={this.changeUrl}
                        margin="normal"
                        fullWidth
                    />
                </div>
            </>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    url: state.edit.url,
});

export const UrlForm = connect<StateProps, DispatchProps>(
    mapStateToProps,
    {
        updateUrl,
    },
)(withStyles(styles)(UrlFormInner));
