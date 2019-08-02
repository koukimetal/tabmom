import { CronRule } from './components/table/actions';

const RULES_KEY = 'rules';

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
