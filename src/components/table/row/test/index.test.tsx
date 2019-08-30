import * as React from 'react';
import { SystemState, TimeRangeType, CronRule } from "../../../system/actions";
import { shallow } from "enzyme";
import {RuleTableRowInner} from '../';

describe('<RuleTableRow>', () => {

    let systemBase: SystemState;
    const editModal = jest.fn();
    const swapRule = jest.fn();
    const classes: any = {};

    const getADummyRule = (id: string) => ({
            id,
            url: 'dummyUrl',
            name: 'dummyName',
            active: false,
            oneTime: false,
            clockConfig: {
                type: TimeRangeType.ALL
            }
    });

    const addARule = (rule: CronRule, current = 0) => {
        systemBase.rules[rule.id] = rule;
        systemBase.ruleOrder.unshift(rule.id);
        if (current > 0) {
            systemBase.current[rule.id] = current;
        }
    }

    beforeEach(() => {
        systemBase = {
            rules: {},
            ruleOrder: [],
            current: {},
            nowDate: {
                nowMinutes: 0,
                nowDay: 0
            }
        };
        editModal.mockClear();
        swapRule.mockClear();
    });

    test('Test three rules', () => {
        const d1 = getADummyRule('d1');
        const d2 = getADummyRule('d2');
        const d3 = getADummyRule('d3');
        addARule(d3); // bottom
        addARule(d2); // middle
        addARule(d1); // top
        // todo test d1, d2, d3 and count up and down button
        const wrapper = shallow(<RuleTableRowInner id={'d1'} idx={0} system={systemBase} editModal={editModal} swapRule={swapRule} classes={classes}/>);
        // expect(wrapper).toMatchSnapshot();
    });
});