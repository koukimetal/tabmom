import * as React from 'react';
import { connect } from 'react-redux';
import { AppState } from 'components/store';
import { Theme, createStyles, WithStyles, TableRow, TableCell, IconButton, Link } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { SystemState, swapRule, TimeRangeType } from '../../system/actions';
import { editModal } from '../../edit/actions';
import { Edit as EditIcon, ArrowUpward as UpIcon, ArrowDownward as DownIcon } from '@material-ui/icons';
import { ActiveWrapper } from '../active_wrapper';
import { TimeDisplay } from '../time_display';

export const styles = (theme: Theme) =>
    createStyles({
        cell: {
            padding: theme.spacing(1),
        },
    });

interface OwnProps {
    id: string;
    idx: number;
}

interface DispatchProps {
    editModal: typeof editModal;
    swapRule: typeof swapRule;
}

interface StateProps extends OwnProps {
    system: SystemState;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

export class RuleTableRowInner extends React.Component<Props> {
    private clickEdit = () => {
        const { system, id } = this.props;
        const rule = system.rules[id];
        if (rule.clockConfig.type === TimeRangeType.ONCE) {
            this.props.editModal(rule);
        } else {
            const current = system.current[id] || rule.clockConfig.period;
            this.props.editModal(rule, current);
        }
    };

    private openLink = () => {
        const { system, id } = this.props;
        const rule = system.rules[id];
        chrome.tabs.create({ url: rule.url });
    };

    private swapRule = (a: number, b: number) => {
        this.props.swapRule(a, b);
    };

    private swapUp = () => {
        const { idx } = this.props;
        this.swapRule(idx - 1, idx);
    };

    private swapDown = () => {
        const { idx } = this.props;
        this.swapRule(idx, idx + 1);
    };

    public render() {
        const { system, classes, id, idx } = this.props;
        const rule = system.rules[id];
        return (
            <TableRow>
                <TableCell className={classes.cell}>
                    <IconButton aria-label="edit" size="small" onClick={this.clickEdit}>
                        <EditIcon fontSize="inherit" />
                    </IconButton>
                </TableCell>
                <TableCell className={classes.cell}>
                    <ActiveWrapper rule={rule} nowDate={system.nowDate}>
                        <TimeDisplay rule={rule} currentMap={system.current} />
                    </ActiveWrapper>
                </TableCell>
                <TableCell component="th" scope="row" className={classes.cell}>
                    <Link component="button" onClick={this.openLink}>
                        {rule.name}
                    </Link>
                </TableCell>
                <TableCell className={classes.cell}>
                    {idx > 0 && (
                        <IconButton aria-label="edit" size="small" onClick={this.swapUp} data-test-id="swapUp">
                            <UpIcon fontSize="inherit" />
                        </IconButton>
                    )}
                    {idx < system.ruleOrder.length - 1 && (
                        <IconButton aria-label="edit" size="small" onClick={this.swapDown} data-test-id="swapDown">
                            <DownIcon fontSize="inherit" />
                        </IconButton>
                    )}
                </TableCell>
            </TableRow>
        );
    }
}

const mapStateToProps = (state: AppState, ownProps: OwnProps): StateProps => ({
    system: state.system,
    idx: ownProps.idx,
    id: ownProps.id,
});

export const RuleTableRow = connect<StateProps, DispatchProps, OwnProps>(
    mapStateToProps,
    { editModal, swapRule },
)(withStyles(styles)(RuleTableRowInner));
