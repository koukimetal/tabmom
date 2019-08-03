import * as React from 'react';
import { configureStore } from './components/store';
import { Provider } from 'react-redux';
import { Controller } from './components/controller';
import { EditModal } from './components/edit';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { RuleTable } from './components/table';
import { CronRule } from './components/table/actions';
import { saveRules, CounterMessage, TabMomMessage, MessageType } from './proxy';
import { setCounter } from './components/controller/actions';

const theme = createMuiTheme({});
export interface AppProps {
    rules: CronRule[];
    counter: number;
}
export const App: React.SFC<AppProps> = props => {
    const store = configureStore(props);

    let previous = props.rules;
    store.subscribe(() => {
        const { rules } = store.getState().table;
        if (previous !== rules) {
            saveRules(rules);
            previous = rules;
        }
    });
    chrome.runtime.onMessage.addListener((message: TabMomMessage) => {
        if (message.type === MessageType.COUNTER) {
            store.dispatch(setCounter(message.counter));
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
