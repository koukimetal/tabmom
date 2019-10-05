import { TimeRangeType } from '../../../system/actions';
import { ClockConfigEdit, ModalMode, InfoToValidate } from '../../actions';

export type InputValidator = (infoToValidate: InfoToValidate) => boolean;

export const isValidTime = (time: string) => {
    const [sHour, sMin] = time.split(':');
    if (!sHour || !sMin) {
        return false;
    }
    const hour = parseInt(sHour);
    const min = parseInt(sMin);
    if (!Number.isInteger(hour) || !Number.isInteger(min)) {
        return false;
    }

    return 0 <= hour && hour < 24 && 0 <= min && min < 60;
};

export const startTimeValidator = (config: ClockConfigEdit): boolean => {
    if (config.type === TimeRangeType.ALL) {
        return true;
    } else {
        // MANY, ONCE
        return isValidTime(config.startTime);
    }
};

export const endTimeValidator = (config: ClockConfigEdit): boolean => {
    if (config.type === TimeRangeType.ALL || config.type === TimeRangeType.ONCE) {
        return true;
    } else {
        // MANY
        return isValidTime(config.endTime);
    }
};

export const periodValidator = (config: ClockConfigEdit): boolean => {
    if (config.type === TimeRangeType.ONCE) {
        return true;
    } else {
        // ALL or ANY
        const period = parseInt(config.period);
        return Number.isInteger(period) && period > 0;
    }
};

export const currentValidator = (config: ClockConfigEdit, mode: ModalMode, currentString: string): boolean => {
    if (config.type === TimeRangeType.ONCE) {
        return true;
    } else {
        // ALL or ANY
        if (mode === ModalMode.CREATE) {
            return true;
        } else {
            const current = parseInt(currentString);
            return Number.isInteger(current) && current > 0;
        }
    }
};

const INPUT_VALIDATORS: readonly InputValidator[] = [
    info => startTimeValidator(info.clockConfig),
    info => endTimeValidator(info.clockConfig),
    info => periodValidator(info.clockConfig),
    info => currentValidator(info.clockConfig, info.mode, info.current),
];

export const isValidInput = (infoToValidate: InfoToValidate) => {
    return INPUT_VALIDATORS.reduce((acc, validator) => acc && validator(infoToValidate), true);
};
