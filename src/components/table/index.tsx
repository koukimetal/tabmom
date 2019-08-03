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
import { TableState } from './actions';
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
            width: 10,
        },
        table: {
            minWidth: 600,
        },
    });

interface DispatchProps {
    editModal: typeof editModal;
}

interface StateProps {
    table: TableState;
}

interface Props extends DispatchProps, StateProps, WithStyles<typeof styles> {}

class RuleTableInner extends React.Component<Props> {
    private edit = (idx: number) => {
        const { table } = this.props;
        this.props.editModal(table.rules[idx], idx);
    };

    private openLink = (url: string) => {
        chrome.tabs.create({ url });
    };

    public render() {
        const { table, classes } = this.props;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.edit}>Edit</TableCell>
                            <TableCell className={classes.period}>Period</TableCell>
                            <TableCell>Title</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {table.rules.map((rule, idx) => (
                            <TableRow key={idx}>
                                <TableCell>
                                    <IconButton aria-label="edit" size="small" onClick={() => this.edit(idx)}>
                                        <EditIcon fontSize="inherit" />
                                    </IconButton>
                                </TableCell>
                                <TableCell>{rule.active ? rule.period.toString() : <OffIcon />}</TableCell>
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
    { editModal },
)(withStyles(styles)(RuleTableInner));
