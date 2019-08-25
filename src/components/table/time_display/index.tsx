import * as React from 'react';
import { convertNumbetToTime } from '../../shared';
import { SystemState, CronRule, TimeRangeType, SystemDate } from '../../system/actions';

export const TimeDisplay: React.SFC<{
    system: SystemState;
    rule: CronRule;
    nowDate: SystemDate;
}> = props => {
    const { rule, system } = props;
    if (rule.clockConfig.type === TimeRangeType.ALL || rule.clockConfig.type === TimeRangeType.MANY) {
        const current = system.current[rule.id] || rule.clockConfig.period;
        return <>{current.toString() + ' / ' + rule.clockConfig.period.toString()}</>;
    } else {
        // ONCE
        return <>{convertNumbetToTime(rule.clockConfig.startTime)}</>;
    }
};
