export const getNowNumber = () => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
};
