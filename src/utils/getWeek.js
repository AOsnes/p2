/*Fucntion to get the current week number */
function getWeek(date){
    //Thursday in current week decides the year.
    let dateData = new Date(date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7));
    //Sets the date back to the current date
    date.setDate(new Date().getDate());
    //January 4 is always in week 1.
    let week1 = new Date(dateData.getFullYear(), 0, 4);
    //Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((dateData.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
}

export default getWeek;