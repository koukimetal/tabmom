import { combineReducers } from 'redux';
const SET_COUNTER = '@controller/SET_COUNTER';

interface SetCounterAction {
    type: typeof SET_COUNTER;
    counter: number;
}

type ControllerAction = SetCounterAction;

export interface ControllerState {
    counter: number;
}

const counter = (state = -1, action: ControllerAction) => {
    switch (action.type) {
        case SET_COUNTER:
            return action.counter;
        default:
            return state;
    }
};

export const setCounter = (counter: number): SetCounterAction => {
    return {
        type: SET_COUNTER,
        counter,
    };
};

export const controllerReducer = combineReducers<ControllerState, ControllerAction>({
    counter,
});
