import { combineReducers } from 'redux';
const UPDATE_URL = '@edit/UPDATE_URL';
const UPDATE_NAME = '@edit/UPDATE_NAME';
const UPDATE_PERIOD = '@edit/UPDATE_PERIOD';
const UPDATE_ACTIVE = '@edit/UPDATE_ACTIVE';
const UPDATE_REGEX = '@edit/UPDATE_REGEX';

const OPEN_MODAL = '@edit/OPEN_MODAL';
const CLOSE_MODAL = '@edit/CLOSE_MODAL';

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

interface ActiveAction {
    type: typeof UPDATE_ACTIVE;
    active: boolean;
}

interface RegexAction {
    type: typeof UPDATE_REGEX;
    regex: boolean;
}

interface OpenAction {
    type: typeof OPEN_MODAL;
}

interface CloseAction {
    type: typeof CLOSE_MODAL;
}

type EditModalAction = NameAction | UrlAction | PeriodAction | OpenAction | CloseAction | RegexAction | ActiveAction;

export interface EditModalState {
    period: string;
    name: string;
    url: string;
    regex: boolean;
    active: boolean;
    open: boolean;
}

const openReducer = (state = false, action: EditModalAction) => {
    switch (action.type) {
        case OPEN_MODAL:
            return true;
        case CLOSE_MODAL:
            return false;
        default:
            return state;
    }
};

const defaultReducer = <T>(state: T, initialValue: T, action: EditModalAction) => {
    switch (action.type) {
        case CLOSE_MODAL:
            return initialValue;
        default:
            return state;
    }
};

const nameReducer = (state = '', action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_NAME:
            return action.name;
        default:
            return defaultReducer(state, '', action);
    }
};

const urlReducer = (state = '', action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_URL:
            return action.url;
        default:
            return defaultReducer(state, '', action);
    }
};

const periodReducer = (state = '', action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_PERIOD:
            return action.period;
        default:
            return defaultReducer(state, '', action);
    }
};

const activeReducer = (state = true, action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_ACTIVE:
            return action.active;
        default:
            return defaultReducer(state, true, action);
    }
};

const regexReducer = (state = false, action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_REGEX:
            return action.regex;
        default:
            return defaultReducer(state, false, action);
    }
};

export const openModal = (): OpenAction => {
    return {
        type: OPEN_MODAL,
    };
};

export const closeModal = (): CloseAction => {
    return {
        type: CLOSE_MODAL,
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

export const updateActive = (active: boolean): ActiveAction => {
    return {
        type: UPDATE_ACTIVE,
        active,
    };
};

export const updateRegex = (regex: boolean): RegexAction => {
    return {
        type: UPDATE_REGEX,
        regex,
    };
};

export const editModalReducer = combineReducers<EditModalState, EditModalAction>({
    name: nameReducer,
    url: urlReducer,
    period: periodReducer,
    open: openReducer,
    regex: regexReducer,
    active: activeReducer,
});
