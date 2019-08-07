import { combineReducers } from 'redux';
export const ADD_RULE = '@system/ADD_RULE';
export const UPDATE_RULE = '@system/UPDATE_RULE';
export const SWAP_RULE = '@system/SWAP_RULE';
export const DELETE_RULE = '@system/DELETE_RULE';
const DELETE_CURRENT = '@system/DELETE_CURRENT';
export const UPDATE_CURRENT = '@system/UPDATE_CURRENT';
export const SET_NOW_DATE = '@system/SET_NOW_DATE';

export interface SkipInfo {
    ignorePinned: boolean;
    match: string;
}

export interface CronRule {
    id: string;
    url: string;
    name: string;
    period: number;
    active: boolean;
    oneTime: boolean;
    startTime: number;
    endTime: number;
    skipInfo?: SkipInfo;
    weekSetting?: boolean[];
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

interface SwapRule {
    type: typeof SWAP_RULE;
    a: number;
    b: number;
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

// Looks like we can't send raw Date class on Message
export interface SystemDate {
    nowMinutes: number;
    nowDay: number;
}

interface SetNowDate {
    type: typeof SET_NOW_DATE;
    date: SystemDate;
}

export type SystemAction = AddRule | UpdateRule | DeleteRule | DeleteCurrent | UpdateCurrent | SwapRule | SetNowDate;

export interface CurrentMap {
    [id: string]: number;
}

export interface RuleMap {
    [id: string]: CronRule;
}

export interface SystemState {
    rules: RuleMap;
    ruleOrder: string[];
    current: CurrentMap;
    nowDate: SystemDate;
}

const ruleOrder = (state: string[] = [], action: SystemAction) => {
    switch (action.type) {
        case ADD_RULE:
            return [action.rule.id, ...state];
        case DELETE_RULE:
            return state.filter(id => id !== action.id);
        case SWAP_RULE:
            const next = [...state];
            const tmp = next[action.a];
            next[action.a] = next[action.b];
            next[action.b] = tmp;
            return next;
        default:
            return state;
    }
};

const rules = (state: RuleMap = {}, action: SystemAction) => {
    switch (action.type) {
        case ADD_RULE:
            return { ...state, [action.rule.id]: action.rule };
        case UPDATE_RULE:
            return Object.assign({}, state, { [action.rule.id]: action.rule });
        case DELETE_RULE:
            const next = { ...state };
            delete next[action.id];
            return next;
        default:
            return state;
    }
};

const nowDate = (state: SystemDate = null, action: SystemAction) => {
    switch (action.type) {
        case SET_NOW_DATE:
            return action.date;
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

export const swapRule = (a: number, b: number): SwapRule => {
    return {
        type: SWAP_RULE,
        a,
        b,
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

export const setNowDate = (date: SystemDate): SetNowDate => {
    return {
        type: SET_NOW_DATE,
        date,
    };
};
export const systemReducer = combineReducers<SystemState, SystemAction>({
    rules,
    current,
    ruleOrder,
    nowDate,
});
