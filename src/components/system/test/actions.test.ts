import {
    systemReducer,
    CronRule,
    TimeRangeType,
    addRule,
    swapRule,
    deleteRule,
    updateRule,
    updateCurrent,
    deleteCurrent,
    setNowDate,
} from '../actions';
import { createStore } from 'redux';

describe('test for System', () => {
    let store = createStore(systemReducer);
    let rules: CronRule[] = [];

    beforeEach(() => {
        store = createStore(systemReducer);
        rules = [];
        for (let i = 0; i < 5; i++) {
            rules.push({
                id: 'd' + i,
                url: 'dummyURL',
                name: 'dummyName',
                active: false,
                oneTime: false,
                clockConfig: {
                    type: TimeRangeType.ALL,
                },
            });
        }
    });

    test('Latter rule should be first', () => {
        store.dispatch(addRule(rules[0]));
        store.dispatch(addRule(rules[1]));
        expect(store.getState().ruleOrder[0]).toEqual('d1');
        expect(store.getState().ruleOrder[1]).toEqual('d0');
    });

    test('Swap', () => {
        store.dispatch(addRule(rules[0]));
        store.dispatch(addRule(rules[1]));
        store.dispatch(addRule(rules[2]));
        store.dispatch(swapRule(0, 2));
        expect(store.getState().ruleOrder[0]).toEqual('d0');
        expect(store.getState().ruleOrder[2]).toEqual('d2');
    });

    test('Delete', () => {
        store.dispatch(addRule(rules[0]));
        store.dispatch(addRule(rules[1]));
        store.dispatch(addRule(rules[2]));
        store.dispatch(deleteRule('d1'));
        expect(store.getState().ruleOrder[0]).toEqual('d2');
        expect(store.getState().ruleOrder[1]).toEqual('d0');
    });

    test('Update', () => {
        store.dispatch(addRule(rules[0]));
        const updatedRule = Object.assign({}, rules[0], { url: 'updatedURL' });
        store.dispatch(updateRule(updatedRule));
        expect(store.getState().rules['d0'].url).toEqual('updatedURL');
    });

    test('Current', () => {
        store.dispatch(updateCurrent('d0', 10));
        expect(store.getState().current['d0']).toBe(10);
        store.dispatch(deleteCurrent('d0'));
        expect(store.getState().current).not.toHaveProperty('d0');
    });

    test('Date', () => {
        const systemDate = { nowDay: 1, nowMinutes: 12 };
        store.dispatch(setNowDate(systemDate));
        expect(store.getState().nowDate).toEqual(systemDate);
    });
});
