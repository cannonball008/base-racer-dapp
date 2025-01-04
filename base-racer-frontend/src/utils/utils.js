export const getTodayDate = () => {
    const currentdate = new Date();
    const year = currentdate.getFullYear();
    const month = parseInt(currentdate.getMonth())+1;
    const day = currentdate.getDate();
    return year+'-'+((month < 10) ? '0'+month : month) +'-'+((parseInt(day) < 10 ? '0'+day : day));
}