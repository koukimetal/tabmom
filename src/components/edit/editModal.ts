import { combineReducers } from 'redux';
const UPDATE_URL = '@edit/UPDATE_URL';
const UPDATE_NAME = '@edit/UPDATE_NAME';
const UPDATE_PERIOD = '@edit/UPDATE_PERIOD';
const SAVE_RULE = '@edit/SAVE_RULE';
const OPEN_MODAL = '@edit/OPEN_MODAL';
const CANCEL_MODAL = '@edit/CANCEL_MODAL';

interface NameAction {
    type: typeof UPDATE_NAME;
    name: string;
}

interface UrlAction {
    type: typeof UPDATE_URL;
    url: string;
}

interface PeriodAction {
    type: typeof UPDATE_PERIOD;
    period: string;
}

interface SaveAction {
    type: typeof SAVE_RULE;
}

interface OpenAction {
    type: typeof OPEN_MODAL;
}

interface CancelAction {
    type: typeof CANCEL_MODAL;
}

export type EditModalTypes = NameAction | UrlAction | PeriodAction | SaveAction | OpenAction | CancelAction;

export interface EditModalState {
    period: string;
    name: string;
    url: string;
    open: boolean;
}

const openReducer = (state = false, action: EditModalTypes) => {
    switch (action.type) {
        case OPEN_MODAL:
            return true;
        case CANCEL_MODAL:
            return false;
        default:
            return state;
    }
};

const nameReducer = (state = '', action: EditModalTypes) => {
    switch (action.type) {
        case UPDATE_NAME:
            return action.name;
        case SAVE_RULE:
        case CANCEL_MODAL:
            return '';
        default:
            return state;
    }
};

const urlReducer = (state = '', action: EditModalTypes) => {
    switch (action.type) {
        case UPDATE_URL:
            return action.url;
        case SAVE_RULE:
        case CANCEL_MODAL:
            return '';
        default:
            return state;
    }
};

const periodReducer = (state = '', action: EditModalTypes) => {
    switch (action.type) {
        case UPDATE_NAME:
            return action.name;
        case SAVE_RULE:
        case CANCEL_MODAL:
            return '';
        default:
            return state;
    }
};

export const openModal = (): OpenAction => {
    return {
        type: OPEN_MODAL,
    };
};

export const cancelModal = (): CancelAction => {
    return {
        type: CANCEL_MODAL,
    };
};

export const updateName = (name: string): NameAction => {
    return {
        type: UPDATE_NAME,
        name,
    };
};
export const updateUrl = (url: string): UrlAction => {
    return {
        type: UPDATE_URL,
        url,
    };
};
export const updatePeriod = (period: string): PeriodAction => {
    return {
        type: UPDATE_PERIOD,
        period,
    };
};
export const saveRule = (): SaveAction => {
    return {
        type: SAVE_RULE,
    };
};

export const editModalReducer = combineReducers<EditModalState, EditModalTypes>({
    name: nameReducer,
    url: urlReducer,
    period: periodReducer,
    open: openReducer,
});
