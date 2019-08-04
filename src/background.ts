import { getRules, TimerMessage, MessageType, getCurrentTime, setCurrentTime } from './proxy';
const main = () => {
    chrome.alarms.create('MINUTE', { periodInMinutes: 1 });
    chrome.alarms.onAlarm.addListener(async alarm => {
        if (alarm.name === 'MINUTE') {
            const rules = await getRules();
            await Promise.all(
                rules.map(async rule => {
                    let time = await getCurrentTime(rule.id);
                    if (!time) {
                        time = rule.period;
                    }

                    if (!rule.active) {
                        return;
                    }

                    let disactivate = false;
                    if (time <= 1) {
                        if (rule.oneTime) {
                            disactivate = true;
                        }
                        time = rule.period;
                        chrome.tabs.create({ url: rule.url });
                    } else {
                        time--;
                    }
                    await setCurrentTime(rule.id, time);
                    const message: TimerMessage = { type: MessageType.TIMER, id: rule.id, time, disactivate };
                    chrome.runtime.sendMessage(message);
                }),
            );
        }
    });
};

(() => {
    main();
})();
