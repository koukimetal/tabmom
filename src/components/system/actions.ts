import { combineReducers } from 'redux';
export const ADD_RULE = '@system/ADD_RULE';
const UPDATE_RULE = '@system/UPDATE_RULE';
export const DELETE_RULE = '@system/DELETE_RULE';
const DELETE_CURRENT = '@system/DELETE_CURRENT';
export const UPDATE_CURRENT = '@system/UPDATE_CURRENT';

export interface CronRule {
    id: string;
    url: string;
    name: string;
    period: number;
    active: boolean;
}

interface AddRule {
    type: typeof ADD_RULE;
    rule: CronRule;
}

interface UpdateRule {
    type: typeof UPDATE_RULE;
    rule: CronRule;
}

interface DeleteRule {
    type: typeof DELETE_RULE;
    id: string;
}

interface DeleteCurrent {
    type: typeof DELETE_CURRENT;
    id: string;
}

interface UpdateCurrent {
    type: typeof UPDATE_CURRENT;
    id: string;
    time: number;
}

export type SystemAction = AddRule | UpdateRule | DeleteRule | DeleteCurrent | UpdateCurrent;

export interface CurrentMap {
    [id: string]: number;
}
export interface SystemState {
    rules: CronRule[];
    current: CurrentMap;
}

const rules = (state: CronRule[] = [], action: SystemAction) => {
    switch (action.type) {
        case ADD_RULE:
            return [...state, action.rule];
        case UPDATE_RULE:
            return state.map(rule => (rule.id === action.rule.id ? action.rule : rule));
        case DELETE_RULE:
            return state.filter(rule => rule.id !== action.id);
        default:
            return state;
    }
};

const current = (state: CurrentMap = {}, action: SystemAction) => {
    switch (action.type) {
        case DELETE_CURRENT:
            delete state[action.id];
            return { ...state };
        case UPDATE_CURRENT:
            state[action.id] = action.time;
            return { ...state };
        default:
            return state;
    }
};

export const addRule = (rule: CronRule): AddRule => {
    return {
        type: ADD_RULE,
        rule,
    };
};

export const updateRule = (rule: CronRule): UpdateRule => {
    return {
        type: UPDATE_RULE,
        rule,
    };
};

export const deleteRule = (id: string): DeleteRule => {
    return {
        type: DELETE_RULE,
        id,
    };
};

export const deleteCurrent = (id: string): DeleteCurrent => {
    return {
        type: DELETE_CURRENT,
        id,
    };
};

export const updateCurrent = (id: string, time: number): UpdateCurrent => {
    return {
        type: UPDATE_CURRENT,
        id,
        time,
    };
};

export const systemReducer = combineReducers<SystemState, SystemAction>({
    rules,
    current,
});
