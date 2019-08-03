import { getRules, CounterMessage, MessageType, setCounter } from './proxy';
const main = () => {
    chrome.alarms.create('MINUTE', { periodInMinutes: 1 });
    let counter = 1;
    setCounter(counter);
    chrome.alarms.onAlarm.addListener(async alarm => {
        if (alarm.name === 'MINUTE') {
            const message: CounterMessage = { type: MessageType.COUNTER, counter };
            setCounter(counter);
            chrome.runtime.sendMessage(message);
            const rules = await getRules();
            rules.forEach(rule => {
                if (counter % rule.period === 0) {
                    chrome.tabs.create({ url: rule.url });
                }
            });
            counter++;
        }
    });
};

(() => {
    main();
})();
