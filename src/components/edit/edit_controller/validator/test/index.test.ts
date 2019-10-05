import { ClockConfigEdit, ModalMode } from '../../../../edit/actions';
import { TimeRangeType } from '../../../../system/actions';
import { startTimeValidator, endTimeValidator, periodValidator, currentValidator, isValidInput, isValidTime } from '..';

describe('Test validator', () => {
    test('test start', () => {
        const confAll: ClockConfigEdit = {
            type: TimeRangeType.ALL,
        };
        expect(startTimeValidator(confAll)).toBe(true);
        const confStart: ClockConfigEdit = {
            type: TimeRangeType.MANY,
            startTime: '12:34',
        };
        expect(startTimeValidator(confStart)).toBe(true);
        const confStartWrong: ClockConfigEdit = {
            type: TimeRangeType.MANY,
            startTime: '00:60',
        };
        expect(startTimeValidator(confStartWrong)).toBe(false);
    });

    test('test end', () => {
        const confAll: ClockConfigEdit = {
            type: TimeRangeType.ALL,
        };
        expect(endTimeValidator(confAll)).toBe(true);
        const confEnd: ClockConfigEdit = {
            type: TimeRangeType.MANY,
            endTime: '12:34',
        };
        expect(endTimeValidator(confEnd)).toBe(true);
        const confEndWrong: ClockConfigEdit = {
            type: TimeRangeType.MANY,
            endTime: '24:00',
        };
        expect(endTimeValidator(confEndWrong)).toBe(false);
    });

    test('test period', () => {
        const confOnce: ClockConfigEdit = {
            type: TimeRangeType.ONCE,
        };
        expect(periodValidator(confOnce)).toBe(true);
        const confPeriod: ClockConfigEdit = {
            type: TimeRangeType.MANY,
            period: '10',
        };
        expect(periodValidator(confPeriod)).toBe(true);
        const confPeriodWrong: ClockConfigEdit = {
            type: TimeRangeType.MANY,
            period: '-1',
        };
        expect(periodValidator(confPeriodWrong)).toBe(false);
    });

    test('test current', () => {
        const confOnce: ClockConfigEdit = {
            type: TimeRangeType.ONCE,
        };
        expect(currentValidator(confOnce, ModalMode.EDIT, '1')).toBe(true);
        const confCurrent: ClockConfigEdit = {
            type: TimeRangeType.MANY,
        };
        expect(currentValidator(confCurrent, ModalMode.EDIT, '1')).toBe(true);
        expect(currentValidator(confCurrent, ModalMode.EDIT, '-1')).toBe(false);
        expect(currentValidator(confCurrent, ModalMode.CREATE, '')).toBe(true);
    });

    test('test valid input', () => {
        const conf: ClockConfigEdit = {
            type: TimeRangeType.ONCE,
            startTime: '01:12',
        };
        expect(
            isValidInput({
                clockConfig: conf,
                mode: ModalMode.CREATE,
            }),
        ).toBe(true);
    });

    test('test time', () => {
        expect(isValidTime('-1:23')).toBe(false);
        expect(isValidTime('1:60')).toBe(false);
        expect(isValidTime('24:23')).toBe(false);
        expect(isValidTime('01:23')).toBe(true);
        expect(isValidTime('1:23')).toBe(true);
        expect(isValidTime('00:00')).toBe(true);
        expect(isValidTime('23:59')).toBe(true);
    });
});
