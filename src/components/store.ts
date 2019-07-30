import { tableReducer } from './table/actions';
import { editModalReducer } from './edit/actions';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const rootReducer = combineReducers({
    edit: editModalReducer,
    table: tableReducer,
});

export const configureStore = () => {
    const middlewares: any[] = [];
    const middleWareEnhancer = applyMiddleware(...middlewares);

    const store = createStore(rootReducer, composeWithDevTools(middleWareEnhancer));

    return store;
};

export type AppState = ReturnType<typeof rootReducer>;
