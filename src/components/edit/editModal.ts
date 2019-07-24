import { getSimpleReducerAndActionCreator, SimpleAction } from './../../utilities/simpleReducer';
import { combineReducers } from 'redux';
const UPDATE_URL = '@edit/UPDATE_URL'
const UPDATE_NAME = '@edit/UPDATE_NAME'
const UPDATE_PERIOD = '@edit/UPDATE_PERIOD'

export type EditModalTypes = SimpleAction<string>;

export interface EditModalState {
    period: string
    name: string
    url: string
}

const nameRAC = getSimpleReducerAndActionCreator('', UPDATE_NAME);
const urlRAC  = getSimpleReducerAndActionCreator('', UPDATE_URL);
const periodRAC  = getSimpleReducerAndActionCreator('', UPDATE_PERIOD);

export const updateName = nameRAC.actionCreator;
export const updateURL = urlRAC.actionCreator;
export const updatePeriod = periodRAC.actionCreator;

const editModalReducer = combineReducers<EditModalState, EditModalTypes>({
    name: nameRAC.reducer,
    url: urlRAC.reducer,
    period: periodRAC.reducer
});
