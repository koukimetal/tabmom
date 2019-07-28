import { editModalReducer } from './edit/editModal';
import { combineReducers, applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';

const rootReducer = combineReducers({
    edit: editModalReducer,
});

export const configureStore = () => {
    const middlewares: any[] = [];
    const middleWareEnhancer = applyMiddleware(...middlewares);

    const store = createStore(rootReducer, composeWithDevTools(middleWareEnhancer));

    return store;
};

export type AppState = ReturnType<typeof rootReducer>;
