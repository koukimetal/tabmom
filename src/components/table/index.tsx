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
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { SystemState } from '../system/actions';
import { RuleTableRow } from './row';

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
    });

interface StateProps {
    system: SystemState;
}

interface Props extends StateProps, WithStyles<typeof styles> {}

class RuleTableInner extends React.Component<Props> {
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
                        {system.ruleOrder.map((id, idx) => (
                            <RuleTableRow key={id} id={id} idx={idx} />
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

const mapStateToProps = (state: AppState): StateProps => ({
    system: state.system,
});

export const RuleTable = connect<StateProps, {}>(
    mapStateToProps,
    {},
)(withStyles(styles)(RuleTableInner));
