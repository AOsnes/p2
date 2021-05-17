/*Fucntion to get the current week number */
function getWeek(date){
    let dateData = new Date(date);
    //Thursday in current week decides the year.
    new Date(dateData.setDate(dateData.getDate() + 3 - (dateData.getDay() + 6) % 7));
    //January 4 is always in week 1.
    let week1 = new Date(dateData.getFullYear(), 0, 4);
    //Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((dateData.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

export default getWeek;