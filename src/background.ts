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
} from './proxy';
const main = () => {
    chrome.alarms.create('MINUTE', { periodInMinutes: 1 });
    chrome.alarms.onAlarm.addListener(async alarm => {
        if (alarm.name === 'MINUTE') {
            const nowNumber = getNowNumber();
            const ruleOrder = (await getRuleOrder()) || [];
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
                        if (rule.startTime <= nowNumber && nowNumber <= rule.endTime) {
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
