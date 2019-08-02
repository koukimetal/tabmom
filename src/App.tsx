import * as React from 'react';
import { configureStore } from './components/store';
import { Provider } from 'react-redux';
import { Controller } from './components/controller';
import { EditModal } from './components/edit';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { RuleTable } from './components/table';
import { CronRule } from './components/table/actions';
import { saveRules } from './proxy';

const theme = createMuiTheme({});
interface Props {
    rules: CronRule[];
}
export const App: React.SFC<Props> = props => {
    const store = configureStore(props.rules);

    let previous = props.rules;
    store.subscribe(() => {
        const { rules } = store.getState().table;
        if (previous !== rules) {
            saveRules(rules);
            previous = rules;
        }
    });
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                <EditModal />
                <Controller />
                <RuleTable />
            </Provider>
        </ThemeProvider>
    );
};
