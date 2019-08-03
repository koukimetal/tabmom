import { controllerReducer } from './controller/actions';
import { AppProps } from './../App';
import { tableReducer } from './table/actions';
import { editModalReducer } from './edit/actions';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const rootReducer = combineReducers({
    edit: editModalReducer,
    table: tableReducer,
    controller: controllerReducer,
});

export const configureStore = (appProps: AppProps) => {
    const middlewares: any[] = [];
    const middleWareEnhancer = applyMiddleware(...middlewares);

    const store = createStore(
        rootReducer,
        {
            table: {
                rules: appProps.rules,
            },
            controller: {
                counter: appProps.counter,
            },
        },
        composeWithDevTools(middleWareEnhancer),
    );

    return store;
};

export type AppState = ReturnType<typeof rootReducer>;
