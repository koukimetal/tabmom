import { getRules } from './proxy';
const main = () => {
    chrome.alarms.create('MINUTE', { periodInMinutes: 1 });
    let counter = 0;
    chrome.alarms.onAlarm.addListener(async alarm => {
        if (alarm.name === 'MINUTE') {
            counter++;
            const rules = await getRules();
            rules.forEach(rule => {
                if (counter % rule.period === 0) {
                    chrome.tabs.create({ url: rule.url });
                }
            });
        }
    });
};

(() => {
    main();
})();
