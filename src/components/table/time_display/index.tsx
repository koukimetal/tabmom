import * as React from 'react';
import * as shared from '../../shared';
import { CronRule, TimeRangeType, CurrentMap } from '../../system/actions';

export const TimeDisplay: React.SFC<{
    currentMap: CurrentMap;
    rule: CronRule;
}> = props => {
    const { rule, currentMap } = props;
    if (rule.clockConfig.type === TimeRangeType.ALL || rule.clockConfig.type === TimeRangeType.MANY) {
        const current = currentMap[rule.id] || rule.clockConfig.period;
        return <>{current.toString() + ' / ' + rule.clockConfig.period.toString()}</>;
    } else {
        // ONCE
        return <>{shared.convertNumbetToTime(rule.clockConfig.startTime)}</>;
    }
};
