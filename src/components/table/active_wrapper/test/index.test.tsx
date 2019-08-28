import * as React from 'react';
import { shallow } from 'enzyme';
import { CronRule, TimeRangeType, SystemDate } from "../../../system/actions";
import { ActiveWrapper } from "..";
import { HighlightOff as OffIcon } from '@material-ui/icons';

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

    test('Test inactive', () => {
        const rule = Object.assign({}, ruleBase, {
            active: false
        });
        const wrapper = shallow(<ActiveWrapper rule={rule} nowDate={systemDateBase} />);
        expect(wrapper.contains(<OffIcon />)).toBe(true);
    });

    test('Test range', () => {
        const rule = Object.assign({}, ruleBase, {
            weekSetting: weekSettingBase,
            clockConfig: {
                type: TimeRangeType.MANY,
                startTime: 20, endTime: 30
            },
        });
        const wrapper = shallow(<ActiveWrapper rule={rule} nowDate={systemDateBase} />);
        expect(/\(.*\)/.test(wrapper.text())).toBe(true);
    });

    test('Test Once', () => {
        const rule = Object.assign({}, ruleBase, {
            weekSetting: weekSettingBase,
            clockConfig: {
                type: TimeRangeType.MANY,
                startTime: 20
            },
        });
        const wrapper = shallow(<ActiveWrapper rule={rule} nowDate={systemDateBase} />);
        expect(/\(.*\)/.test(wrapper.text())).toBe(true);
    });
});