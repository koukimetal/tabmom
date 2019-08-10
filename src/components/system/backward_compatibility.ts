import { SkipInfo, CronRule, TimeRangeType } from './actions';

interface CronRuleV0 {
    id: string;
    url: string;
    name: string;
    period: number;
    active: boolean;
    oneTime: boolean;
    startTime: number;
    endTime: number;
    skipInfo?: SkipInfo;
    weekSetting?: boolean[];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isCronRuleV0 = (x: any | CronRuleV0): x is CronRuleV0 => {
    return (
        x &&
        typeof x.id === 'string' &&
        typeof x.url === 'string' &&
        typeof x.name === 'string' &&
        typeof x.period === 'number' &&
        typeof x.active === 'boolean' &&
        typeof x.oneTime === 'boolean' &&
        typeof x.startTime === 'number' &&
        typeof x.endTime === 'number'
    );
};

export const convertToLatest = (x: CronRuleV0 | CronRule): CronRule => {
    if (isCronRuleV0(x)) {
        console.log('Converted', x.name, 'To V1');
        return {
            id: x.id,
            url: x.url,
            name: x.name,
            active: x.active,
            oneTime: x.oneTime,
            clockConfig: {
                type: TimeRangeType.MANY,
                startTime: x.startTime,
                endTime: x.endTime,
                period: x.period,
            },
            skipInfo: x.skipInfo,
            weekSetting: x.weekSetting,
        };
    } else {
        return x;
    }
};
