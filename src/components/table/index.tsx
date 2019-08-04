import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'components/store';
import {
    Theme,
    createStyles,
    WithStyles,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Link,
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { SystemState, CronRule } from '../system/actions';
import { editModal } from '../edit/actions';
import { Edit as EditIcon, HighlightOff as OffIcon } from '@material-ui/icons';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            marginTop: theme.spacing(3),
            overflowX: 'auto',
        },
        edit: {
            width: 10,
        },
        period: {
            width: 60,
        },
        table: {
            minWidth: 600,
        },
    });

interface DispatchProps {
    editModal: typeof editModal;
}

interface StateProps {
    system: SystemState;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class RuleTableInner extends React.Component<Props> {
    private edit = (id: string) => {
        const { system } = this.props;
        const rule = system.rules.find(rule => rule.id === id);
        this.props.editModal(rule);
    };

    private openLink = (url: string) => {
        chrome.tabs.create({ url });
    };

    private renderTableRow = (rule: CronRule) => {
        const { system } = this.props;
        if (!system.current[rule.id]) {
            console.error('Sync error', rule.name);
        }
        const remains = system.current[rule.id] ? system.current[rule.id] : rule.period;
        return (
            <TableRow key={rule.id}>
                <TableCell>
                    <IconButton aria-label="edit" size="small" onClick={() => this.edit(rule.id)}>
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                </TableCell>
                <TableCell>{rule.active ? remains.toString() + ' / ' + rule.period.toString() : <OffIcon />}</TableCell>
                <TableCell component="th" scope="row">
                    <Link
                        component="button"
                        onClick={() => {
                            this.openLink(rule.url);
                        }}
                    >
                        {rule.name}
                    </Link>
                </TableCell>
            </TableRow>
        );
    };

    public render() {
        const { system, classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.edit}>Edit</TableCell>
                            <TableCell className={classes.period}>Rmn / Prd</TableCell>
                            <TableCell>Title</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>{system.rules.map(rule => this.renderTableRow(rule))}</TableBody>
                </Table>
            </Paper>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => ({
    system: state.system,
});

export const RuleTable = connect<StateProps, DispatchProps>(
    mapStateToProps,
    { editModal },
)(withStyles(styles)(RuleTableInner));
