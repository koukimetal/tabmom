import { systemReducer, CronRule, TimeRangeType, addRule } from '../actions';
import { createStore } from 'redux';

describe('test for System', () => {
    let store = createStore(systemReducer);
    let baseRule: CronRule = null;

    beforeEach(() => {
        store = createStore(systemReducer);
        baseRule = {
            id: 'dummyId',
            url: 'dummyURL',
            name: 'dummyName',
            active: false,
            oneTime: false,
            clockConfig: {
                type: TimeRangeType.ALL,
            },
        };
    });

    test('Latter rule should be first', () => {
        const rule1 = Object.assign({}, baseRule, { id: '1' });
        const rule2 = Object.assign({}, baseRule, { id: '2' });
        store.dispatch(addRule(rule1));
        store.dispatch(addRule(rule2));
        expect(store.getState().ruleOrder[0]).toEqual('2');
        expect(store.getState().ruleOrder[1]).toEqual('1');
    });
});
