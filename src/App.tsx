import * as React from 'react';
import { configureStore } from './components/store';
import { Provider } from 'react-redux';
import { Controller } from './components/controller';
import { EditModal } from './components/edit';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { RuleTable } from './components/table';
import {
    CronRule,
    CurrentMap,
    updateCurrent,
    ADD_RULE as SYSTEM_ADD_RULE,
    DELETE_RULE as SYSTEM_DELETE_RULE,
    UPDATE_CURRENT as SYSTEM_UPDATE_CURRENT,
} from './components/system/actions';
import { saveRules, TabMomMessage, MessageType, setCurrentTime, deleteCurrentTime } from './proxy';

const theme = createMuiTheme({});
export interface AppProps {
    rules: CronRule[];
    current: CurrentMap;
}

export const App: React.SFC<AppProps> = props => {
    const store = configureStore(props);

    let previousRule = props.rules;
    store.subscribe(() => {
        const { rules } = store.getState().system;
        if (previousRule !== rules) {
            saveRules(rules);
            previousRule = rules;
        }

        const { lastAction } = store.getState();

        if (lastAction) {
            if (lastAction.type === SYSTEM_ADD_RULE) {
                setCurrentTime(lastAction.rule.id, lastAction.rule.period);
            } else if (lastAction.type === SYSTEM_DELETE_RULE) {
                deleteCurrentTime(lastAction.id);
            } else if (lastAction.type === SYSTEM_UPDATE_CURRENT) {
                setCurrentTime(lastAction.id, lastAction.time);
            }
        }
    });
    chrome.runtime.onMessage.addListener((message: TabMomMessage) => {
        if (message.type === MessageType.TIMER) {
            store.dispatch(updateCurrent(message.id, message.time));
            // may need to inactive for one time in the future.
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
