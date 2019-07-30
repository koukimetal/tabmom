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
import { TableState } from './actions';
import { Mood as TrueIcon, MoodBad as FalseIcon } from '@material-ui/icons';

const styles = (theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            marginTop: theme.spacing(3),
            overflowX: 'auto',
        },
        active: {
          width: 10
        },
        period: {
          width: 10
        },
        table: {
            minWidth: 600,
        },
    });

interface Props extends WithStyles<typeof styles> {
    table: TableState;
}

class RuleTableInner extends React.Component<Props> {
    public render() {
        const { table, classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.active}>Active</TableCell>
                            <TableCell className={classes.period}>Period</TableCell>
                            <TableCell>Title</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {table.rules.map((rule, idx) => (
                            <TableRow key={idx}>
                                <TableCell>{rule.active ? <TrueIcon/> : <FalseIcon />}</TableCell>
                                <TableCell>{rule.period.toString()}</TableCell>
                                <TableCell component="th" scope="row">
                                    {rule.name}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

const mapStateToProps = (state: AppState) => ({
    table: state.table,
});

export const RuleTable = connect(
    mapStateToProps,
    {},
)(withStyles(styles)(RuleTableInner));
