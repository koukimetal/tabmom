import { calculateNowMinutes } from '../shared';
import { MessageType, UpdateNowDateMessage, getRuleOrder } from '../proxy';
import { RuleManager } from './rule_manager';

export enum AlarmName {
    MINUTE = 'MINUTE',
}

export const updateNowDate = (nowMinutes: number, nowDay: number) => {
    const updateNowDateMessage: UpdateNowDateMessage = {
        type: MessageType.UPDATE_NOW_DATE,
        date: {
            nowMinutes,
            nowDay,
        },
    };
    chrome.runtime.sendMessage(updateNowDateMessage);
};

export const alarmListner = async (
    alarm: chrome.alarms.Alarm,
    previousMinutes: number,
    updatePreviousMinutes: (num: number) => void,
) => {
    if (alarm.name === AlarmName.MINUTE) {
        const now = new Date();
        const nowMinutes = calculateNowMinutes(now);
        if (previousMinutes === null || previousMinutes > nowMinutes) {
            previousMinutes = nowMinutes - 1;
        }
        const nowDay = now.getDay();
        updateNowDate(nowMinutes, nowDay);
        const ruleOrder = (await getRuleOrder()) || [];

        const manager: RuleManager = await RuleManager.getInstance(nowDay, nowMinutes, previousMinutes);

        await Promise.all(ruleOrder.map(manager.handleRule));
        updatePreviousMinutes(nowMinutes);
    }
};
