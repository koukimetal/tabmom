import { CronRule } from './../table/actions';
import { combineReducers } from 'redux';
const UPDATE_URL = '@edit/UPDATE_URL';
const UPDATE_NAME = '@edit/UPDATE_NAME';
const UPDATE_PERIOD = '@edit/UPDATE_PERIOD';
const UPDATE_ACTIVE = '@edit/UPDATE_ACTIVE';

const OPEN_MODAL_CREATE = '@edit/OPEN_MODAL_CREATE';
const OPEN_MODAL_EDIT = '@edit/OPEN_MODAL_EDIT';
const CLOSE_MODAL = '@edit/CLOSE_MODAL';

const UPDATE_DELETE_FLAG = '@edit/UPDATE_DELETE_FLAG';

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

interface OpenCreateAction {
    type: typeof OPEN_MODAL_CREATE;
}

interface OpenEditAction {
    type: typeof OPEN_MODAL_EDIT;
    rule: CronRule;
    index: number;
}

interface DeleteFlagAction {
    type: typeof UPDATE_DELETE_FLAG;
    flag: boolean;
}

interface CloseAction {
    type: typeof CLOSE_MODAL;
}

export enum ModalMode {
    CREATE,
    EDIT,
    CLOSED,
}

type EditModalAction =
    | NameAction
    | UrlAction
    | PeriodAction
    | OpenCreateAction
    | CloseAction
    | ActiveAction
    | DeleteFlagAction
    | OpenEditAction;

export interface EditModalState {
    period: string;
    name: string;
    url: string;
    active: boolean;
    mode: ModalMode;
    editIndex: number;
    deleteFlag: boolean;
}

const modalModeReducer = (state = ModalMode.CLOSED, action: EditModalAction) => {
    switch (action.type) {
        case OPEN_MODAL_CREATE:
            return ModalMode.CREATE;
        case OPEN_MODAL_EDIT:
            return ModalMode.EDIT;
        case CLOSE_MODAL:
            return ModalMode.CLOSED;
        default:
            return state;
    }
};

const editIndexReducer = (state = -1, action: EditModalAction) => {
    switch (action.type) {
        case OPEN_MODAL_CREATE:
            return -1;
        case OPEN_MODAL_EDIT:
            return action.index;
        case CLOSE_MODAL:
            return -1;
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

const deleteFlagReducer = (state = false, action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_DELETE_FLAG:
            return action.flag;
        default:
            return defaultReducer(state, false, action);
    }
};

const nameReducer = (state = '', action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_NAME:
            return action.name;
        case OPEN_MODAL_EDIT:
            return action.rule.name;
        default:
            return defaultReducer(state, '', action);
    }
};

const urlReducer = (state = '', action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_URL:
            return action.url;
        case OPEN_MODAL_EDIT:
            return action.rule.url;
        default:
            return defaultReducer(state, '', action);
    }
};

const periodReducer = (state = '', action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_PERIOD:
            return action.period;
        case OPEN_MODAL_EDIT:
            return action.rule.period.toString();
        default:
            return defaultReducer(state, '', action);
    }
};

const activeReducer = (state = true, action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_ACTIVE:
            return action.active;
        case OPEN_MODAL_EDIT:
            return action.rule.active;
        default:
            return defaultReducer(state, true, action);
    }
};

export const openModal = (): OpenCreateAction => {
    return {
        type: OPEN_MODAL_CREATE,
    };
};

export const editModal = (rule: CronRule, index: number): OpenEditAction => {
    return {
        type: OPEN_MODAL_EDIT,
        rule,
        index,
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

export const updateDeleteFlag = (flag: boolean): DeleteFlagAction => {
    return {
        type: UPDATE_DELETE_FLAG,
        flag,
    };
};

export const editModalReducer = combineReducers<EditModalState, EditModalAction>({
    name: nameReducer,
    url: urlReducer,
    period: periodReducer,
    mode: modalModeReducer,
    active: activeReducer,
    editIndex: editIndexReducer,
    deleteFlag: deleteFlagReducer,
});
