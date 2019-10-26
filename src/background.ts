import { alarmListner, AlarmName } from 'back';
const main = () => {
    chrome.alarms.create(AlarmName.MINUTE, { periodInMinutes: 1 });
    let previousMinutes: number = null;
    const updatePreviousMinutes = (minutes: number) => {
        previousMinutes = minutes;
    };
    chrome.alarms.onAlarm.addListener(async alarm => {
        if (alarm.name === AlarmName.MINUTE) {
            await alarmListner(alarm, previousMinutes, updatePreviousMinutes);
        }
    });
};

(() => {
    main();
})();
