import * as React from 'react';
import { connect } from 'react-redux';
import { openModal } from '../edit/actions';
import { Theme, createStyles, WithStyles, Button } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Create as CreateIcon } from '@material-ui/icons';
import { GitHubLogo } from '../ads/github';
const styles = (theme: Theme) =>
    createStyles({
        button: {
            margin: theme.spacing(1),
        },
        root: {
            display: 'flex',
        },
        github: {
            cursor: 'pointer',
            marginLeft: 'auto',
            marginTop: 'auto',
            marginBottom: 'auto',
        },
    });

interface DispatchProps {
    openModal: typeof openModal;
}

interface Props extends DispatchProps, WithStyles<typeof styles> {}

class ControllerInner extends React.Component<Props> {
    private open = () => {
        this.props.openModal();
    };

    private openGitHub = () => {
        chrome.tabs.create({ url: 'https://github.com/koukimetal/tabmom' });
    };

    public render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <div>
                    <Button variant="contained" color="primary" className={classes.button} onClick={this.open}>
                        <CreateIcon />
                        CREATE
                    </Button>
                </div>
                <div className={classes.github} onClick={this.openGitHub}>
                    <GitHubLogo size={32} />
                </div>
            </div>
        );
    }
}

const mapStateToProps = () => ({});

export const Controller = connect<{}, DispatchProps>(
    mapStateToProps,
    { openModal },
)(withStyles(styles)(ControllerInner));
