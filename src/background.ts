

const main = () => {
    (window as any).a = 3;
    chrome.alarms.create('MINUTE', {periodInMinutes: 1});
    chrome.alarms.onAlarm.addListener((alarm) => {
        (window as any).a = (window as any).a + 1;
        console.log((window as any).a);
        if (alarm.name === 'MINUTE') {
            chrome.tabs.create({ url: 'https://mail.google.com/mail/' });
        }
    })
};

(() => {
    main();
})();
