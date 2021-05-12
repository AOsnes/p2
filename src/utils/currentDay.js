import getWeekday from '../utils/getWeekday';

/* Finds and returns current day of the week */
function currentDay(){
    return getWeekday(new Date().getDay())
}

export default currentDay;