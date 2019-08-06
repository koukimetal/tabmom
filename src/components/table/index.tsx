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
import { SystemState, CronRule, swapRule } from '../system/actions';
import { editModal } from '../edit/actions';
import {
    Edit as EditIcon,
    HighlightOff as OffIcon,
    ArrowUpward as UpIcon,
    ArrowDownward as DownIcon,
} from '@material-ui/icons';
import { getNowNumber } from '../../shared';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            marginTop: theme.spacing(3),
            overflowX: 'auto',
        },
        title: {
            padding: theme.spacing(1),
        },
        order: {
            padding: theme.spacing(1),
            width: 50,
        },
        edit: {
            padding: theme.spacing(1),
            width: 10,
        },
        period: {
            padding: theme.spacing(1),
            width: 91,
        },
        table: {
            minWidth: 600,
        },
        cell: {
            padding: theme.spacing(1),
        },
    });

interface DispatchProps {
    editModal: typeof editModal;
    swapRule: typeof swapRule;
}

interface StateProps {
    system: SystemState;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class RuleTableInner extends React.Component<Props> {
    private getCurrent(rule: CronRule) {
        const { system } = this.props;
        if (!system.current[rule.id]) {
            console.error('Sync error', rule.name);
        }
        return system.current[rule.id] ? system.current[rule.id] : rule.period;
    }

    private clickEdit = (id: string) => {
        const { system } = this.props;
        const rule = system.rules[id];
        const current = this.getCurrent(rule);
        this.props.editModal(rule, current);
    };

    private openLink = (url: string) => {
        chrome.tabs.create({ url });
    };

    private swapRule = (a: number, b: number) => {
        this.props.swapRule(a, b);
    };


    private renderTableRow = (rule: CronRule, idx: number, ruleSize: number, nowNumber: number) => {
        const remains = this.getCurrent(rule);
        const { classes } = this.props;
        const outOfRange = nowNumber < rule.startTime || rule.endTime < nowNumber;
        return (
            <TableRow key={rule.id}>
                <TableCell className={classes.cell}>
                    <IconButton aria-label="edit" size="small" onClick={() => this.clickEdit(rule.id)}>
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                </TableCell>
                <TableCell className={classes.cell}>
                    {rule.active ? (
                        (outOfRange ? '(' : '') +
                        (rule.oneTime ? '*' : '') + remains.toString() + ' / ' + rule.period.toString() +
                        (outOfRange ? ')' : '')
                    ) : (
                        <OffIcon />
                    )}
                </TableCell>
                <TableCell component="th" scope="row" className={classes.cell}>
                    <Link
                        component="button"
                        onClick={() => {
                            this.openLink(rule.url);
                        }}
                    >
                        {rule.name}
                    </Link>
                </TableCell>
                <TableCell className={classes.cell}>
                    {idx > 0 && (
                        <IconButton aria-label="edit" size="small" onClick={() => this.swapRule(idx - 1, idx)}>
                            <UpIcon fontSize="inherit" />
                        </IconButton>
                    )}
                    {idx < ruleSize - 1 && (
                        <IconButton aria-label="edit" size="small" onClick={() => this.swapRule(idx, idx + 1)}>
                            <DownIcon fontSize="inherit" />
                        </IconButton>
                    )}
                </TableCell>
            </TableRow>
        );
    };

    public render() {
        const { system, classes } = this.props;

        const nowNumber = getNowNumber();
        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.edit}>Edit</TableCell>
                            <TableCell className={classes.period}>Rmn / Prd</TableCell>
                            <TableCell className={classes.title}>Title</TableCell>
                            <TableCell className={classes.order}>Order</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {system.ruleOrder.map((id, idx) =>
                            this.renderTableRow(system.rules[id], idx, system.ruleOrder.length, nowNumber),
                        )}
                    </TableBody>
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
    { editModal, swapRule },
)(withStyles(styles)(RuleTableInner));
