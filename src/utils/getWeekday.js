/* returns the name of the day as a string, day parameter should come from Date.getDay method. */
function getWeekday(day){
    let weekday = null;
    switch(day){
        case 0: weekday = "Søndag"; break;
        case 1: weekday = "Mandag"; break;
        case 2: weekday = "Tirsdag"; break;
        case 3: weekday = "Onsdag"; break;
        case 4: weekday = "Torsdag"; break;
        case 5: weekday = "Fredag"; break;
        case 6: weekday = "Lørdag"; break;
        default: /* TODO: Something is straight up buggin yuh */ break;
    }
    return weekday;
}

export default getWeekday;