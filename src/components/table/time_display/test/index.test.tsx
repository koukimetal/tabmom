import * as React from 'react';
import { mount } from 'enzyme';
import { CronRule, TimeRangeType, CurrentMap } from '../../../system/actions';
import { TimeDisplay } from '..';
import { convertNumbetToTime } from '../../../shared';

jest.mock('../../../shared', () => {
    return {
        convertNumbetToTime: jest.fn(),
    };
});

describe('<TimeDisplay />', () => {
    let ruleBase: CronRule;
    let currentBase: CurrentMap;
    const mockConvertNumbetToTime = (convertNumbetToTime as unknown) as jest.Mock<typeof convertNumbetToTime>;

    beforeEach(() => {
        ruleBase = {
            id: 'dummy',
            url: 'dummyURL',
            name: 'dummyName',
            active: false,
            oneTime: false,
            clockConfig: {
                type: TimeRangeType.ALL,
                period: 10,
            },
        };
        currentBase = {
            dummy: 1,
        };

        mockConvertNumbetToTime.mockClear();
    });

    test('Test ALL', () => {
        const wrapper = mount(<TimeDisplay rule={ruleBase} currentMap={currentBase} />);
        expect(wrapper.text().includes('1 / 10')).toBe(true);
    });

    test('Test ONCE', () => {
        const rule = Object.assign<{}, CronRule, Partial<CronRule>>({}, ruleBase, {
            clockConfig: {
                type: TimeRangeType.ONCE,
                startTime: 10,
            },
        });
        mount(<TimeDisplay rule={rule} currentMap={currentBase} />);
        expect(mockConvertNumbetToTime).toBeCalled();
    });
});
