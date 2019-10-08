import * as React from 'react';
import { EditModalState } from '../../../../edit/actions';
import { TimeRangeType } from '../../../../system/actions';
import { shallow } from 'enzyme';
import { SaveButtonInner, SaveCopyBaseProps, CopyButtonInner } from '..';

/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-object-literal-type-assertion */

describe('Test save copy', () => {
    let defaultValue: SaveCopyBaseProps = null;
    const closeModal = jest.fn();
    const addRule = jest.fn();
    const updateRule = jest.fn();
    const deleteCurrent = jest.fn();
    const systemUpdateCurrent = jest.fn();

    beforeEach(() => {
        defaultValue = {
            closeModal,
            addRule,
            updateRule,
            deleteCurrent,
            systemUpdateCurrent,
            edit: null as EditModalState,
            validInput: true,
            classes: {} as any,
        };
        (Object.keys(defaultValue) as (keyof typeof defaultValue)[]).forEach(key => {
            if (typeof defaultValue[key] === 'function') {
                (defaultValue[key] as jest.Mock).mockClear();
            }
        });
    });

    test('test convert time', () => {
        const wd = shallow<SaveButtonInner>(<SaveButtonInner {...defaultValue} />);
        expect(wd.instance().convertTimeToNumber('23:59')).toEqual(60 * 24 - 1);
    });

    test('test getClockConfig', () => {
        const wd = shallow<SaveButtonInner>(<SaveButtonInner {...defaultValue} />);
        expect(
            wd.instance().getClockConfig({
                type: TimeRangeType.ALL,
                period: '1',
            }),
        ).toMatchSnapshot();
        expect(
            wd.instance().getClockConfig({
                type: TimeRangeType.ONCE,
                startTime: '00:00',
            }),
        ).toMatchSnapshot();
        expect(
            wd.instance().getClockConfig({
                type: TimeRangeType.MANY,
                period: '3',
                startTime: '00:00',
                endTime: '01:23',
            }),
        ).toMatchSnapshot();
    });

    test('test getRule', () => {
        defaultValue.edit = {
            clockConfig: {
                type: TimeRangeType.MANY,
                period: '3',
                startTime: '00:00',
                endTime: '01:23',
            },
            isWeekSettingActive: true,
            isSkipInfoActive: true,
            skipInfo: {
                ignorePinned: true,
                match: 'aaa',
            },
            weekSetting: [true, true, true, true, true, true, true],
        } as EditModalState;
        const wd1 = shallow<SaveButtonInner>(<SaveButtonInner {...defaultValue} />);
        expect(wd1.instance().getRule('id')).toMatchSnapshot();
        defaultValue.edit.isSkipInfoActive = false;
        defaultValue.edit.isWeekSettingActive = false;
        const wd2 = shallow<SaveButtonInner>(<SaveButtonInner {...defaultValue} />);
        expect(wd2.instance().getRule('id')).toMatchSnapshot();
    });

    test('test update', () => {
        defaultValue.edit = {
            clockConfig: {
                type: TimeRangeType.MANY,
                period: '3',
                startTime: '00:00',
                endTime: '01:23',
            },
            current: '2',
        } as EditModalState;
        const wd1 = shallow<SaveButtonInner>(<SaveButtonInner {...defaultValue} />);

        // need period with update
        wd1.instance().update('id1');
        expect(systemUpdateCurrent.call.length).toEqual(1);
        expect(updateRule.call.length).toEqual(1);

        systemUpdateCurrent.mockClear();

        // need period with create
        wd1.instance().update(null);
        expect(systemUpdateCurrent.call.length).toEqual(1);
        expect(addRule.call.length).toEqual(1);

        // no need period
        defaultValue.edit.clockConfig.type = TimeRangeType.ONCE;
        const wd2 = shallow<SaveButtonInner>(<SaveButtonInner {...defaultValue} />);
        wd2.instance().update(null);
        expect(deleteCurrent.call.length).toEqual(1);
    });

    test('test save', () => {
        defaultValue.edit = { targetId: 'id' } as EditModalState;
        const wd = shallow<SaveButtonInner>(<SaveButtonInner {...defaultValue} />);
        wd.instance().update = jest.fn();
        wd.instance().save({ preventDefault: jest.fn() } as any);
        expect(closeModal.call.length).toEqual(1);
    });

    test('test copy', () => {
        const wd = shallow<CopyButtonInner>(<CopyButtonInner {...defaultValue} />);
        wd.instance().update = jest.fn();
        wd.instance().copy();
        expect(closeModal.call.length).toEqual(1);
    });
});
