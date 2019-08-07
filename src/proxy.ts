import { CronRule, SystemDate } from './components/system/actions';

const RULE_ORDER_KEY = 'rule_order';
const RULE_PREFIX = 'RULE_';
const CURRNET_PREFIX = 'CURRENT_';

export interface TabInfo {
    url: string;
    pinned: boolean;
}

export const setRule = (rule: CronRule) =>
    new Promise(resolve => {
        const key = RULE_PREFIX + rule.id;
        chrome.storage.local.set({ [key]: rule }, () => {
            resolve();
        });
    });

export const getRule = (id: string) =>
    new Promise<CronRule>(resolve => {
        const key = RULE_PREFIX + id;
        chrome.storage.local.get([key], values => {
            resolve(values[key]);
        });
    });

export const deleteRule = (id: string) =>
    new Promise<void>(resolve => {
        const key = RULE_PREFIX + id;
        chrome.storage.local.remove([key], () => {
            resolve();
        });
    });

export const setRuleOrder = (ruleOrder: string[]) =>
    new Promise(resolve => {
        chrome.storage.local.set({ [RULE_ORDER_KEY]: ruleOrder }, () => {
            resolve();
        });
    });

export const getRuleOrder = () =>
    new Promise<string[]>(resolve => {
        chrome.storage.local.get([RULE_ORDER_KEY], values => {
            resolve(values[RULE_ORDER_KEY]);
        });
    });

export const setCurrentTime = (id: string, time: number) =>
    new Promise<void>(resolve => {
        const key = CURRNET_PREFIX + id;
        chrome.storage.local.set({ [key]: time }, () => {
            resolve();
        });
    });

export const getCurrentTime = (id: string) =>
    new Promise<number>(resolve => {
        const key = CURRNET_PREFIX + id;
        chrome.storage.local.get([key], values => {
            resolve(values[key]);
        });
    });

export const deleteCurrentTime = (id: string) =>
    new Promise<void>(resolve => {
        const key = CURRNET_PREFIX + id;
        chrome.storage.local.remove(key, () => {
            resolve();
        });
    });

export const getAllTabs = () =>
    new Promise<TabInfo[]>(resolve => {
        chrome.tabs.query({}, tabs => {
            const tabArray: TabInfo[] = tabs.map(({ url, pinned }) => ({
                url,
                pinned,
            }));
            resolve(tabArray);
        });
    });

export enum MessageType {
    TIMER,
    UPDATE_RULE,
    UPDATE_NOW_DATE,
}

export interface TimerMessage {
    type: MessageType.TIMER;
    id: string;
    time: number;
}

export interface UpdateRuleMessage {
    type: MessageType.UPDATE_RULE;
    rule: CronRule;
}

export interface UpdateNowDateMessage {
    type: MessageType.UPDATE_NOW_DATE;
    date: SystemDate;
}

export type TabMomMessage = TimerMessage | UpdateRuleMessage | UpdateNowDateMessage;
