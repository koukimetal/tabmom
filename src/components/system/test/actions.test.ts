import { systemReducer, CronRule, TimeRangeType, addRule, swapRule, deleteRule } from '../actions';
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
});
