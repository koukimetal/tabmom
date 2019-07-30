import { combineReducers } from 'redux';
const ADD_RULE = '@table/ADD_RULE';
const UPDATE_RULE = '@table/UPDATE_RULE';
const DELETE_RULE = '@table/DELETE_RULE';

export interface CronRule {
    url: string;
    name: string;
    period: number;
    active: boolean;
    regex: boolean;
}

interface AddAction {
    type: typeof ADD_RULE;
    rule: CronRule;
}

interface UpdateAction {
    type: typeof UPDATE_RULE;
    rule: CronRule;
    index: number;
}

interface DeleteAction {
    type: typeof DELETE_RULE;
    index: number;
}

type TableAction = AddAction | UpdateAction | DeleteAction;

export interface TableState {
    rules: CronRule[];
}

const rulesReducer = (state: CronRule[] = [], action: TableAction) => {
    switch (action.type) {
        case ADD_RULE:
            return [...state, action.rule];
        case UPDATE_RULE:
            return state.map((rule, idx) => (idx === action.index ? action.rule : rule));
        case DELETE_RULE:
            return state.filter((rule, idx) => idx !== action.index);
        default:
            return state;
    }
};

export const addRule = (rule: CronRule): AddAction => {
    return {
        type: ADD_RULE,
        rule,
    };
};

export const updateRule = (rule: CronRule, index: number): UpdateAction => {
    return {
        type: UPDATE_RULE,
        index,
        rule,
    };
};

export const deleteRule = (index: number): DeleteAction => {
    return {
        type: DELETE_RULE,
        index,
    };
};

export const tableReducer = combineReducers<TableState, TableAction>({
    rules: rulesReducer,
});
