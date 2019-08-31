import * as React from 'react';
import { SystemState, TimeRangeType, CronRule } from '../../../system/actions';
import { shallow } from 'enzyme';
import { RuleTableRowInner } from '../';

describe('<RuleTableRow>', () => {
    let systemBase: SystemState;
    const editModal = jest.fn();
    const swapRule = jest.fn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const classes: any = {};
    let d1, d2, d3: CronRule;

    const downSelector = '[data-test-tag="swapDown"]';
    const upSelector = '[data-test-tag="swapUp"]';
    const editSelector = '[data-test-tag="edit"]';

    const getADummyRule = (id: string): CronRule => ({
        id,
        url: 'dummyUrl',
        name: 'dummyName',
        active: false,
        oneTime: false,
        clockConfig: {
            type: TimeRangeType.ALL,
            period: 10,
        },
    });

    const addARule = (rule: CronRule, current = 0) => {
        systemBase.rules[rule.id] = rule;
        systemBase.ruleOrder.unshift(rule.id);
        if (current > 0) {
            systemBase.current[rule.id] = current;
        }
    };

    beforeEach(() => {
        systemBase = {
            rules: {},
            ruleOrder: [],
            current: {},
            nowDate: {
                nowMinutes: 0,
                nowDay: 0,
            },
        };
        editModal.mockClear();
        swapRule.mockClear();
        d1 = getADummyRule('d1');
        d2 = getADummyRule('d2');
        d3 = getADummyRule('d3');
        d3 = Object.assign<{}, CronRule, Partial<CronRule>>({}, d3, {
            clockConfig: {
                type: TimeRangeType.ONCE,
                startTime: 20,
            },
        });
        addARule(d3); // bottom
        addARule(d2, 5); // middle
        addARule(d1, 5); // top
    });

    test('Test first', () => {
        const wd1 = shallow(
            <RuleTableRowInner
                id={'d1'}
                idx={0}
                system={systemBase}
                editModal={editModal}
                swapRule={swapRule}
                classes={classes}
            />,
        );
        expect(wd1.find(upSelector)).toHaveLength(0);
        expect(wd1.find(downSelector)).toHaveLength(1);
        wd1.find(downSelector).simulate('click');
        expect(swapRule.mock.calls[0][0]).toBe(0);
        expect(swapRule.mock.calls[0][1]).toBe(1);
        wd1.find(editSelector).simulate('click');
        expect(editModal.mock.calls[0][1]).toBe(5);
    });

    test('Test middle', () => {
        const wd2 = shallow(
            <RuleTableRowInner
                id={'d2'}
                idx={1}
                system={systemBase}
                editModal={editModal}
                swapRule={swapRule}
                classes={classes}
            />,
        );
        expect(wd2.find(upSelector)).toHaveLength(1);
        expect(wd2.find(downSelector)).toHaveLength(1);
        wd2.find(downSelector).simulate('click');
        expect(swapRule.mock.calls[0][0]).toBe(1);
        expect(swapRule.mock.calls[0][1]).toBe(2);
        wd2.find(upSelector).simulate('click');
        expect(swapRule.mock.calls[1][0]).toBe(0);
        expect(swapRule.mock.calls[1][1]).toBe(1);

        wd2.find(editSelector).simulate('click');
        expect(editModal.mock.calls[0][1]).toBe(5);
    });

    test('Test bottom', () => {
        const wd3 = shallow(
            <RuleTableRowInner
                id={'d3'}
                idx={2}
                system={systemBase}
                editModal={editModal}
                swapRule={swapRule}
                classes={classes}
            />,
        );
        expect(wd3.find(upSelector)).toHaveLength(1);
        expect(wd3.find(downSelector)).toHaveLength(0);
        wd3.find(upSelector).simulate('click');
        expect(swapRule.mock.calls[0][0]).toBe(1);
        expect(swapRule.mock.calls[0][1]).toBe(2);

        wd3.find(editSelector).simulate('click');
        expect(editModal.mock.calls[0]).toHaveLength(1);
    });
});
