import { CronRule, TimeRangeType } from './components/system/actions';
import { calculateNowMinutes } from './shared';
import {
    getRule,
    TimerMessage,
    MessageType,
    getCurrentTime,
    setCurrentTime,
    getRuleOrder,
    UpdateRuleMessage,
    UpdateNowDateMessage,
    setRule,
    getAllTabs,
} from './proxy';
const main = () => {
    chrome.alarms.create('MINUTE', { periodInMinutes: 1 });
    let previousMinutes: number = null;
    chrome.alarms.onAlarm.addListener(async alarm => {
        if (alarm.name === 'MINUTE') {
            const now = new Date();
            const nowMinutes = calculateNowMinutes(now);
            if (!previousMinutes) {
                previousMinutes = nowMinutes - 1;
            }
            const nowDay = now.getDay();
            const allTabs = await getAllTabs();
            const ruleOrder = (await getRuleOrder()) || [];

            const updateNowDateMessage: UpdateNowDateMessage = {
                type: MessageType.UPDATE_NOW_DATE,
                date: {
                    nowMinutes,
                    nowDay,
                },
            };
            chrome.runtime.sendMessage(updateNowDateMessage);

            const isSatisfyOptions = (rule: CronRule) => {
                const { skipInfo, weekSetting } = rule;

                if (weekSetting) {
                    if (!weekSetting[nowDay]) {
                        return false;
                    }
                }

                if (skipInfo) {
                    const hitTab = allTabs
                        .filter(tab => !(skipInfo.ignorePinned && tab.pinned))
                        .find(tab => tab.url.includes(skipInfo.match));
                    if (hitTab) {
                        return false;
                    }
                }
                return true;
            };

            await Promise.all(
                ruleOrder.map(async id => {
                    const rule = await getRule(id);

                    if (!rule.active) {
                        return;
                    }

                    const { clockConfig } = rule;
                    let shouldOpen = false;
                    let nextCurrent: number = null;
                    if (clockConfig.type === TimeRangeType.ONCE) {
                        const minutes = clockConfig.startTime;
                        const isFitTime = previousMinutes < minutes && minutes <= nowMinutes;
                        shouldOpen = isFitTime && isSatisfyOptions(rule);
                    } else if (clockConfig.type === TimeRangeType.ALL || rule.clockConfig.type === TimeRangeType.MANY) {
                        const current = (await getCurrentTime(rule.id)) || clockConfig.period;
                        nextCurrent = current <= 1 ? clockConfig.period : current - 1;
                        if (clockConfig.type === TimeRangeType.ALL) {
                            shouldOpen = isSatisfyOptions(rule) && current <= 1;
                        } else {
                            // MANY
                            const inRange = clockConfig.startTime <= nowMinutes && nowMinutes <= clockConfig.endTime;
                            shouldOpen = isSatisfyOptions(rule) && inRange && current <= 1;
                        }
                    }

                    if (nextCurrent) {
                        await setCurrentTime(rule.id, nextCurrent);
                        const message: TimerMessage = { type: MessageType.TIMER, id: rule.id, time: nextCurrent };
                        chrome.runtime.sendMessage(message);
                    }

                    if (shouldOpen) {
                        if (rule.oneTime) {
                            const nextRule = Object.assign({}, rule, { active: false });
                            const message: UpdateRuleMessage = {
                                type: MessageType.UPDATE_RULE,
                                rule: nextRule,
                            };
                            await setRule(nextRule);
                            chrome.runtime.sendMessage(message);
                        }
                        chrome.tabs.create({ url: rule.url });
                    }

                    previousMinutes = nowMinutes;
                }),
            );
        }
    });
};

(() => {
    main();
})();
