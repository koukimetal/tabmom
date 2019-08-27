import * as React from 'react';
import { shallow } from 'enzyme';
import { CronRule, TimeRangeType, SystemDate } from "../../../system/actions";
import { ActiveWrapper } from "..";


describe('<ActiveWrapper />', () => {

    let ruleBase: CronRule;
    let weekSettingBase: boolean[];
    let systemDateBase: SystemDate;

    beforeEach(() => {
        ruleBase = {
            id: 'dummy',
            url: 'dummyURL',
            name: 'dummyName',
            active: true,
            oneTime: false,
            clockConfig: {
                type: TimeRangeType.ALL,
            },
        };
        weekSettingBase = new Array<boolean>(7).fill(false);
        systemDateBase = {
            nowDay: 0, nowMinutes: 0
        };
    })

    test('Test week setting', () => {
        const rule = Object.assign({}, ruleBase, {
            weekSetting: weekSettingBase
        });
        const wrapper = shallow(<ActiveWrapper rule={rule} nowDate={systemDateBase} />);
        expect(/\(.*\)/.test(wrapper.text())).toBe(true);
    });
});