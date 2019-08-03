import { CronRule } from './components/table/actions';

const RULES_KEY = 'rules';
const COUNTER_KEY = 'counter';

export const saveRules = (rules: CronRule[]) =>
    new Promise(resolve => {
        chrome.storage.sync.set({ [RULES_KEY]: rules }, () => {
            resolve();
        });
    });

export const getRules = () =>
    new Promise<CronRule[]>(resolve => {
        chrome.storage.sync.get([RULES_KEY], values => {
            resolve(values.rules);
        });
    });

export const setCounter = (counter: number) =>
    new Promise(resolve => {
        chrome.storage.local.set({ [COUNTER_KEY]: counter }, () => {
            resolve();
        });
    });

export const getCounter = () =>
    new Promise<number>(resolve => {
        chrome.storage.local.get([COUNTER_KEY], values => {
            resolve(values.counter);
        });
    });

export enum MessageType {
    COUNTER,
}

export interface CounterMessage {
    type: MessageType.COUNTER;
    counter: number;
}

export type TabMomMessage = CounterMessage;
