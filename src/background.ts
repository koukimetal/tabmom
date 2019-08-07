import { CronRule } from './components/system/actions';
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
    chrome.alarms.onAlarm.addListener(async alarm => {
        if (alarm.name === 'MINUTE') {
            const now = new Date();
            const nowMinutes = calculateNowMinutes(now);
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

            const shouldOpen = (rule: CronRule) => {
                if (nowMinutes < rule.startTime || rule.endTime < nowMinutes) {
                    return false;
                }

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

                    let time = (await getCurrentTime(rule.id)) || rule.period;
                    if (time <= 1) {
                        if (rule.oneTime) {
                            const nextRule = Object.assign({}, rule, { active: false });
                            const message: UpdateRuleMessage = {
                                type: MessageType.UPDATE_RULE,
                                rule: nextRule,
                            };
                            await setRule(nextRule);
                            chrome.runtime.sendMessage(message);
                        }
                        time = rule.period;
                        if (shouldOpen(rule)) {
                            chrome.tabs.create({ url: rule.url });
                        }
                    } else {
                        time--;
                    }
                    await setCurrentTime(rule.id, time);
                    const message: TimerMessage = { type: MessageType.TIMER, id: rule.id, time };
                    chrome.runtime.sendMessage(message);
                }),
            );
        }
    });
};

(() => {
    main();
})();
