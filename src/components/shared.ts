export const convertNumbetToTime = (time: number) => {
    if (time < 0) {
        return '00:00';
    } else if (time >= 60 * 24) {
        return '23:59';
    } else {
        const hour = Math.floor(time / 60)
            .toString()
            .padStart(2, '0');
        const min = (time % 60).toString().padStart(2, '0');
        return hour + ':' + min;
    }
};
