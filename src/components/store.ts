import { AppProps } from './../App';
import { systemReducer, SystemAction } from './system/actions';
import { editModalReducer, EditModalAction } from './edit/actions';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

export type RootAction = SystemAction | EditModalAction;

const lastAction = (state: null = null, action: RootAction) => {
    if (action) {
        return action;
    } else {
        return state;
    }
};

const rootReducer = combineReducers({
    edit: editModalReducer,
    system: systemReducer,
    lastAction,
});

export const configureStore = (appProps: AppProps) => {
    const middlewares: [] = [];
    const middleWareEnhancer = applyMiddleware(...middlewares);

    const store = createStore(
        rootReducer,
        {
            system: {
                rules: appProps.rules,
                current: appProps.current,
            },
        },
        composeWithDevTools(middleWareEnhancer),
    );

    return store;
};

export type AppState = ReturnType<typeof rootReducer>;
