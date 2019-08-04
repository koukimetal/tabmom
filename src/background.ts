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

                    if (time <= 1) {
                        time = rule.period;
                        chrome.tabs.create({ url: rule.url });
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
