import * as React from 'react';
import { CronRule, TimeRangeType, SystemDate } from '../../system/actions';
import { HighlightOff as OffIcon } from '@material-ui/icons';

export const ActiveWrapper: React.SFC<{
    rule: CronRule;
    nowDate: SystemDate;
}> = props => {
    const { rule, nowDate } = props;
    const { nowMinutes, nowDay } = nowDate;

    if (!rule.active) {
        return <OffIcon />;
    }

    let wrapFront = '';
    let wrapBack = '';

    if (
        (rule.weekSetting && !rule.weekSetting[nowDay]) ||
        (rule.clockConfig.type === TimeRangeType.MANY &&
            (nowMinutes < rule.clockConfig.startTime || rule.clockConfig.endTime < nowMinutes)) ||
        (rule.clockConfig.type === TimeRangeType.ONCE && nowMinutes >= rule.clockConfig.startTime)
    ) {
        wrapFront = '(';
        wrapBack = ')';
    }

    if (rule.oneTime) {
        wrapFront += '*';
    }

    return (
        <>
            {wrapFront}
            {props.children}
            {wrapBack}
        </>
    );
};
