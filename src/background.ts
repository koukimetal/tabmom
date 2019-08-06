import { CronRule } from './components/system/actions';
import { getNowNumber } from './shared';
import {
    getRule,
    TimerMessage,
    MessageType,
    getCurrentTime,
    setCurrentTime,
    getRuleOrder,
    UpdateRuleMessage,
    setRule,
    getAllTabs,
} from './proxy';
const main = () => {
    chrome.alarms.create('MINUTE', { periodInMinutes: 1 });
    chrome.alarms.onAlarm.addListener(async alarm => {
        if (alarm.name === 'MINUTE') {
            const nowNumber = getNowNumber();
            const allTabs = await getAllTabs();
            const ruleOrder = (await getRuleOrder()) || [];

            const shouldOpen = (rule: CronRule) => {
                if (nowNumber < rule.startTime || rule.endTime < nowNumber) {
                    return false;
                }

                const { skipInfo } = rule;

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
