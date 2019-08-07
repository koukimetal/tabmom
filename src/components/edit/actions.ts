import { EditModalAction } from './actions';
import { CronRule, SkipInfo } from './../system/actions';
import { combineReducers } from 'redux';
const UPDATE_URL = '@edit/UPDATE_URL';
const UPDATE_CURRENT = '@edit/UPDATE_CURRENT';
const UPDATE_NAME = '@edit/UPDATE_NAME';
const UPDATE_PERIOD = '@edit/UPDATE_PERIOD';
const UPDATE_ACTIVE = '@edit/UPDATE_ACTIVE';
const UPDATE_ONE_TIME = '@edit/UPDATE_ONE_TIME';
const UPDATE_START_TIME = '@edit/UPDATE_START_TIME';
const UPDATE_END_TIME = '@edit/UPDATE_END_TIME';
const UPDATE_IS_SKIP_INFO_ACTIVE = '@edit/UPDATE_IS_SKIP_INFO_ACTIVE';
const UPDATE_SKIP_INFO_IGNORE_PINNED = '@edit/UPDATE_SKIP_INFO_IGNORE_PINNED';
const UPDATE_SKIP_INFO_MATCH = '@edit/UPDATE_SKIP_INFO_MATCH';
const UPDATE_IS_WEEK_SETTING_ACTIVE = '@edit/UPDATE_IS_WEEK_SETTING_ACTIVE';
const UPDATE_WEEK_SETTING = '@edit/UPDATE_WEEK_SETTING';

const OPEN_MODAL_CREATE = '@edit/OPEN_MODAL_CREATE';
const OPEN_MODAL_EDIT = '@edit/OPEN_MODAL_EDIT';
const CLOSE_MODAL = '@edit/CLOSE_MODAL';

const UPDATE_DELETE_FLAG = '@edit/UPDATE_DELETE_FLAG';

interface UpdateIsWeekSettingActive {
    type: typeof UPDATE_IS_WEEK_SETTING_ACTIVE;
    isWeekSettingActive: boolean;
}

interface UpdateWeekSetting {
    type: typeof UPDATE_WEEK_SETTING;
    availability: boolean;
    day: number;
}

interface UpdateIsSkipInfoActive {
    type: typeof UPDATE_IS_SKIP_INFO_ACTIVE;
    isSkipInfoActive: boolean;
}

interface UpdateSkipInfoIgnorePinned {
    type: typeof UPDATE_SKIP_INFO_IGNORE_PINNED;
    ignorePinned: boolean;
}

interface UpdateSkipInfoMatch {
    type: typeof UPDATE_SKIP_INFO_MATCH;
    match: string;
}

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

interface UpdateStartTime {
    type: typeof UPDATE_START_TIME;
    time: string;
}

interface UpdateEndTime {
    type: typeof UPDATE_END_TIME;
    time: string;
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
    | UpdateStartTime
    | UpdateEndTime
    | UpdateCurrent
    | UpdateIsSkipInfoActive
    | UpdateSkipInfoIgnorePinned
    | UpdateSkipInfoMatch
    | UpdateIsWeekSettingActive
    | UpdateWeekSetting
    | OpenModalEdit;

export interface EditModalState {
    period: string;
    name: string;
    url: string;
    active: boolean;
    mode: ModalMode;
    deleteFlag: boolean;
    oneTime: boolean;
    startTime: string;
    endTime: string;
    isSkipInfoActive: boolean;
    isWeekSettingActive: boolean;
    weekSetting: boolean[];
    skipInfo: SkipInfo;
    targetId?: string;
    current?: string;
}

const defaultReducer = <T>(state: T, initialValue: T, action: EditModalAction) => {
    switch (action.type) {
        case CLOSE_MODAL:
            return initialValue;
        default:
            return state;
    }
};

const skipInfoIgnorePinned = (state = false, action: EditModalAction) => {
    switch (action.type) {
        case OPEN_MODAL_CREATE:
            return false;
        case OPEN_MODAL_EDIT:
            if (!action.rule.skipInfo) {
                return false;
            }
            return action.rule.skipInfo.ignorePinned;
        case UPDATE_SKIP_INFO_IGNORE_PINNED:
            return action.ignorePinned;
        default:
            return defaultReducer(state, false, action);
    }
};

const skipInfoMatch = (state = '', action: EditModalAction) => {
    switch (action.type) {
        case OPEN_MODAL_CREATE:
            return '';
        case OPEN_MODAL_EDIT:
            if (!action.rule.skipInfo) {
                return '';
            }
            return action.rule.skipInfo.match;
        case UPDATE_SKIP_INFO_MATCH:
            return action.match;
        default:
            return defaultReducer(state, '', action);
    }
};

const skipInfo = combineReducers<SkipInfo, EditModalAction>({
    ignorePinned: skipInfoIgnorePinned,
    match: skipInfoMatch,
});

const isSkipInfoActive = (state = false, action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_IS_SKIP_INFO_ACTIVE:
            return action.isSkipInfoActive;
        case OPEN_MODAL_CREATE:
            return false;
        case OPEN_MODAL_EDIT:
            return !!action.rule.skipInfo;
        default:
            return defaultReducer(state, false, action);
    }
};

const weekSetting = (state: boolean[] = [], action: EditModalAction) => {
    const initial = new Array<boolean>(7).fill(true);
    switch (action.type) {
        case OPEN_MODAL_CREATE:
            return initial;
        case OPEN_MODAL_EDIT:
            if (!action.rule.weekSetting) {
                return initial;
            }
            return action.rule.weekSetting;
        case UPDATE_WEEK_SETTING:
            const next = [...state];
            next[action.day] = action.availability;
            return next;
        default:
            return defaultReducer(state, initial, action);
    }
};

const isWeekSettingActive = (state = false, action: EditModalAction) => {
    switch (action.type) {
        case OPEN_MODAL_CREATE:
            return false;
        case OPEN_MODAL_EDIT:
            return !!action.rule.weekSetting;
        case UPDATE_IS_WEEK_SETTING_ACTIVE:
            return action.isWeekSettingActive;
        default:
            return defaultReducer(state, false, action);
    }
};

const mode = (state = ModalMode.CLOSED, action: EditModalAction) => {
    switch (action.type) {
        case OPEN_MODAL_CREATE:
            return ModalMode.CREATE;
        case OPEN_MODAL_EDIT:
            return ModalMode.EDIT;
        default:
            return defaultReducer(state, ModalMode.CLOSED, action);
    }
};

const targetId = (state: string = null, action: EditModalAction) => {
    switch (action.type) {
        case OPEN_MODAL_CREATE:
            return null;
        case OPEN_MODAL_EDIT:
            return action.rule.id;
        default:
            return defaultReducer(state, null, action);
    }
};

const convertNumbetToTime = (time: number) => {
    if (time < 0) {
        return '00:00';
    } else if (time >= 60 * 24) {
        return '23:59';
    } else {
        const hour = Math.floor(time / 60)
            .toString()
            .padStart(2, '0');
        const min = (time % 60).toString().padStart(2, '0');
        return hour + ':' + min;
    }
};

const startTime = (state = '00:00', action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_START_TIME:
            return action.time;
        case OPEN_MODAL_EDIT:
            return convertNumbetToTime(action.rule.startTime);
        default:
            return defaultReducer(state, '00:00', action);
    }
};

const endTime = (state = '23:59', action: EditModalAction) => {
    switch (action.type) {
        case UPDATE_END_TIME:
            return action.time;
        case OPEN_MODAL_EDIT:
            return convertNumbetToTime(action.rule.endTime);
        default:
            return defaultReducer(state, '23:59', action);
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

export const updateStartTime = (time: string): UpdateStartTime => {
    return {
        type: UPDATE_START_TIME,
        time,
    };
};

export const updateEndTime = (time: string): UpdateEndTime => {
    return {
        type: UPDATE_END_TIME,
        time,
    };
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

export const updateIsSkipInfoActive = (isSkipInfoActive: boolean): UpdateIsSkipInfoActive => {
    return {
        type: UPDATE_IS_SKIP_INFO_ACTIVE,
        isSkipInfoActive,
    };
};

export const updateSkipInfoIgnorePinned = (ignorePinned: boolean): UpdateSkipInfoIgnorePinned => {
    return {
        type: UPDATE_SKIP_INFO_IGNORE_PINNED,
        ignorePinned,
    };
};

export const updateSkipInfoMatch = (match: string): UpdateSkipInfoMatch => {
    return {
        type: UPDATE_SKIP_INFO_MATCH,
        match,
    };
};

export const updateIsWeekSettingActive = (isWeekSettingActive: boolean): UpdateIsWeekSettingActive => {
    return {
        type: UPDATE_IS_WEEK_SETTING_ACTIVE,
        isWeekSettingActive,
    };
};

export const updateWeekSetting = (day: number, availability: boolean): UpdateWeekSetting => {
    return {
        type: UPDATE_WEEK_SETTING,
        day,
        availability,
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
    startTime,
    endTime,
    current,
    oneTime,
    skipInfo,
    isSkipInfoActive,
    weekSetting,
    isWeekSettingActive,
});
