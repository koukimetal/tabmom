export const calculateNowMinutes = (now: Date) => {
    return now.getHours() * 60 + now.getMinutes();
};
