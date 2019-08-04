import { CronRule } from './components/system/actions';

const RULES_KEY = 'rules';
const CURRNET_PREFIX = 'CURRENT_';

export const saveRules = (rules: CronRule[]) =>
    new Promise(resolve => {
        chrome.storage.sync.set({ [RULES_KEY]: rules }, () => {
            resolve();
        });
    });

export const getRules = () =>
    new Promise<CronRule[]>(resolve => {
        chrome.storage.sync.get([RULES_KEY], values => {
            resolve(values[RULES_KEY]);
        });
    });

export const setCurrentTime = (id: string, time: number) =>
    new Promise(resolve => {
        const key = CURRNET_PREFIX + id;
        chrome.storage.local.set({ [key]: time }, () => {
            resolve();
        });
    });

export const deleteCurrentTime = (id: string) =>
    new Promise(resolve => {
        const key = CURRNET_PREFIX + id;
        chrome.storage.local.remove(key, () => {
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

export enum MessageType {
    TIMER,
}

export interface TimerMessage {
    type: MessageType.TIMER;
    id: string;
    time: number;
    disactivate: boolean;
}

export type TabMomMessage = TimerMessage;
