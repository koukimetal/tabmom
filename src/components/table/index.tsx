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
import { SystemState, CronRule, swapRule, TimeRangeType } from '../system/actions';
import { editModal } from '../edit/actions';
import { Edit as EditIcon, ArrowUpward as UpIcon, ArrowDownward as DownIcon } from '@material-ui/icons';
import { ActiveWrapper } from './active_wrapper';
import { TimeDisplay } from './time_display';

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
    private clickEdit = (id: string) => {
        const { system } = this.props;
        const rule = system.rules[id];
        if (rule.clockConfig.type === TimeRangeType.ONCE) {
            this.props.editModal(rule);
        } else {
            const current = system.current[id] || rule.clockConfig.period;
            this.props.editModal(rule, current);
        }
    };

    private openLink = (url: string) => {
        chrome.tabs.create({ url });
    };

    private swapRule = (a: number, b: number) => {
        this.props.swapRule(a, b);
    };

    private renderTableRow = (rule: CronRule, idx: number) => {
        const { system, classes } = this.props;
        return (
            <TableRow key={rule.id}>
                <TableCell className={classes.cell}>
                    <IconButton aria-label="edit" size="small" onClick={() => this.clickEdit(rule.id)}>
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                </TableCell>
                <TableCell className={classes.cell}>
                    <ActiveWrapper rule={rule} nowDate={system.nowDate}>
                        <TimeDisplay rule={rule} nowDate={system.nowDate} system={system} />
                    </ActiveWrapper>
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
                    {idx < system.ruleOrder.length - 1 && (
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
                        {system.ruleOrder.map((id, idx) => this.renderTableRow(system.rules[id], idx))}
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
