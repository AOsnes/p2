/* Takes a date object and returns a string formatted by HH:MM where H = hours and M = minutes */
function toHHMM(date){
    let hhmm;
    /* 0 will be added before if time is under 10 for both hours and minutes */
    let hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    let mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
    hhmm = hh + ':' + mm;
    return hhmm;
}

export default toHHMM;