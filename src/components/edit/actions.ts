import { CronRule } from './../system/actions';
import { combineReducers } from 'redux';
const UPDATE_URL = '@edit/UPDATE_URL';
const UPDATE_CURRENT = '@edit/UPDATE_CURRENT';
const UPDATE_NAME = '@edit/UPDATE_NAME';
const UPDATE_PERIOD = '@edit/UPDATE_PERIOD';
const UPDATE_ACTIVE = '@edit/UPDATE_ACTIVE';
const UPDATE_ONE_TIME = '@edit/UPDATE_ONE_TIME';

const OPEN_MODAL_CREATE = '@edit/OPEN_MODAL_CREATE';
const OPEN_MODAL_EDIT = '@edit/OPEN_MODAL_EDIT';
const CLOSE_MODAL = '@edit/CLOSE_MODAL';

const UPDATE_DELETE_FLAG = '@edit/UPDATE_DELETE_FLAG';

interface UpdateName {
    type: typeof UPDATE_NAME;
    name: string;
}

interface UpdateUrl {
    type: typeof UPDATE_URL;
    url: string;
}

interface UpdatePeriod {
    type: typeof UPDATE_PERIOD;
    period: string;
}

interface UpdateActive {
    type: typeof UPDATE_ACTIVE;
    active: boolean;
}

interface UpdateOneTime {
    type: typeof UPDATE_ONE_TIME;
    oneTime: boolean;
}

interface OpenModalCreate {
    type: typeof OPEN_MODAL_CREATE;
}

interface OpenModalEdit {
    type: typeof OPEN_MODAL_EDIT;
    rule: CronRule;
    current: number;
}

interface UpdateCurrent {
    type: typeof UPDATE_CURRENT;
    current: string;
}

interface UpdateDeleteFlag {
    type: typeof UPDATE_DELETE_FLAG;
    flag: boolean;
}

interface CloseModal {
    type: typeof CLOSE_MODAL;
}

export enum ModalMode {
    CREATE,
    EDIT,
    CLOSED,
}

export type EditModalAction =
    | UpdateName
    | UpdateUrl
    | UpdatePeriod
    | OpenModalCreate
    | CloseModal
    | UpdateActive
    | UpdateDeleteFlag
    | UpdateOneTime
    | UpdateCurrent
    | OpenModalEdit;

export interface EditModalState {
    period: string;
    name: string;
    url: string;
    active: boolean;
    mode: ModalMode;
    deleteFlag: boolean;
    oneTime: boolean;
    targetId?: string;
    current?: string;
}

const mode = (state = ModalMode.CLOSED, action: EditModalAction) => {
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

const targetId = (state: string = null, action: EditModalAction) => {
    switch (action.type) {
        case OPEN_MODAL_CREATE:
            return null;
        case OPEN_MODAL_EDIT:
            return action.rule.id;
        case CLOSE_MODAL:
            return null;
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

const deleteFlag = (state = false, action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_DELETE_FLAG:
            return action.flag;
        default:
            return defaultReducer(state, false, action);
    }
};

const name = (state = '', action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_NAME:
            return action.name;
        case OPEN_MODAL_EDIT:
            return action.rule.name;
        default:
            return defaultReducer(state, '', action);
    }
};

const url = (state = '', action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_URL:
            return action.url;
        case OPEN_MODAL_EDIT:
            return action.rule.url;
        default:
            return defaultReducer(state, '', action);
    }
};

const period = (state = '', action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_PERIOD:
            return action.period;
        case OPEN_MODAL_EDIT:
            return action.rule.period.toString();
        default:
            return defaultReducer(state, '', action);
    }
};

const active = (state = true, action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_ACTIVE:
            return action.active;
        case OPEN_MODAL_EDIT:
            return action.rule.active;
        default:
            return defaultReducer(state, true, action);
    }
};

const oneTime = (state = false, action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_ONE_TIME:
            return action.oneTime;
        case OPEN_MODAL_EDIT:
            return action.rule.oneTime;
        default:
            return defaultReducer(state, false, action);
    }
};

const current = (state = '', action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_CURRENT:
            return action.current;
        case OPEN_MODAL_EDIT:
            return action.current.toString();
        default:
            return defaultReducer(state, '', action);
    }
};

export const openModal = (): OpenModalCreate => {
    return {
        type: OPEN_MODAL_CREATE,
    };
};

export const editModal = (rule: CronRule, current: number): OpenModalEdit => {
    return {
        type: OPEN_MODAL_EDIT,
        rule,
        current,
    };
};

export const closeModal = (): CloseModal => {
    return {
        type: CLOSE_MODAL,
    };
};

export const updateName = (name: string): UpdateName => {
    return {
        type: UPDATE_NAME,
        name,
    };
};

export const updateCurrent = (current: string): UpdateCurrent => {
    return {
        type: UPDATE_CURRENT,
        current,
    };
};

export const updateUrl = (url: string): UpdateUrl => {
    return {
        type: UPDATE_URL,
        url,
    };
};
export const updatePeriod = (period: string): UpdatePeriod => {
    return {
        type: UPDATE_PERIOD,
        period,
    };
};

export const updateActive = (active: boolean): UpdateActive => {
    return {
        type: UPDATE_ACTIVE,
        active,
    };
};

export const updateOneTime = (oneTime: boolean): UpdateOneTime => {
    return {
        type: UPDATE_ONE_TIME,
        oneTime,
    };
};

export const updateDeleteFlag = (flag: boolean): UpdateDeleteFlag => {
    return {
        type: UPDATE_DELETE_FLAG,
        flag,
    };
};

export const editModalReducer = combineReducers<EditModalState, EditModalAction>({
    name,
    url,
    period,
    mode,
    active,
    targetId,
    deleteFlag,
    current,
    oneTime,
});
