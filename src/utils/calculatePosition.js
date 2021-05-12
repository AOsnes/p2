function calculatePosition(date, offsetHours){
    const startHour = 8; /* Schedule starts at 8 in the morning */
    const totalMinutes = 8*60; /* There is 8 hours on the schedule */
    const hours = date.getHours() - startHour - offsetHours;
    const minutes = date.getMinutes();
    const minutesSinceStartHour = hours*60 + minutes;
    const position = (minutesSinceStartHour / totalMinutes) * 100;
    return `${position}%`;
}

export default calculatePosition;