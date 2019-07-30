import * as React from 'react';
import { configureStore } from './components/store';
import { Provider } from 'react-redux';
import { Controller } from './components/controller';
import { EditModal } from './components/edit';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { RuleTable } from './components/table';

const theme = createMuiTheme({});

export const App: React.SFC<{}> = () => {
    const store = configureStore();
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
