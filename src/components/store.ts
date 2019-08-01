import { tableReducer, CronRule } from './table/actions';
import { editModalReducer } from './edit/actions';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const rootReducer = combineReducers({
    edit: editModalReducer,
    table: tableReducer,
});

export const configureStore = (rules: CronRule[]) => {
    const middlewares: any[] = [];
    const middleWareEnhancer = applyMiddleware(...middlewares);

    const store = createStore(rootReducer, {
        table: {
            rules
        }
    }, composeWithDevTools(middleWareEnhancer));

    return store;
};

export type AppState = ReturnType<typeof rootReducer>;
