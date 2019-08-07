import * as React from 'react';
import { configureStore } from './components/store';
import { Provider } from 'react-redux';
import { Controller } from './components/controller';
import { EditModal } from './components/edit';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { RuleTable } from './components/table';
import {
    updateCurrent,
    ADD_RULE as SYSTEM_ADD_RULE,
    DELETE_RULE as SYSTEM_DELETE_RULE,
    UPDATE_CURRENT as SYSTEM_UPDATE_CURRENT,
    SWAP_RULE as SYSTEM_SWAP_RULE,
    UPDATE_RULE as SYSTEM_UPDATE_RULE,
    updateRule,
    setNowDate,
    SystemState,
} from './components/system/actions';
import {
    setRule,
    TabMomMessage,
    MessageType,
    setCurrentTime,
    deleteCurrentTime,
    setRuleOrder,
    deleteRule,
} from './proxy';

const theme = createMuiTheme({});
export type AppProps = SystemState;

export const App: React.SFC<AppProps> = props => {
    const store = configureStore(props);

    // To avoid confusion, we shouldn't dispatch here.
    store.subscribe(() => {
        const { lastAction } = store.getState();

        if (!lastAction) {
            return;
        }

        if (lastAction.type === SYSTEM_ADD_RULE) {
            setRuleOrder(store.getState().system.ruleOrder);
            setRule(lastAction.rule);
            setCurrentTime(lastAction.rule.id, lastAction.rule.period);
        } else if (lastAction.type === SYSTEM_UPDATE_RULE) {
            setRule(lastAction.rule);
        } else if (lastAction.type === SYSTEM_DELETE_RULE) {
            setRuleOrder(store.getState().system.ruleOrder);
            deleteRule(lastAction.id);
            deleteCurrentTime(lastAction.id);
        } else if (lastAction.type === SYSTEM_SWAP_RULE) {
            setRuleOrder(store.getState().system.ruleOrder);
        } else if (lastAction.type === SYSTEM_UPDATE_CURRENT) {
            setCurrentTime(lastAction.id, lastAction.time);
        }
    });

    // To avoid confusion, we shouldn't modify storage here.
    chrome.runtime.onMessage.addListener((message: TabMomMessage) => {
        if (message.type === MessageType.TIMER) {
            store.dispatch(updateCurrent(message.id, message.time));
        } else if (message.type === MessageType.UPDATE_RULE) {
            store.dispatch(updateRule(message.rule));
        } else if (message.type === MessageType.UPDATE_NOW_DATE) {
            store.dispatch(setNowDate(message.date));
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
