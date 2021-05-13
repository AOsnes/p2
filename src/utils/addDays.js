function addDays(date, days) {
    let changedDate = new Date();
    if(days !== 0) {
        changedDate = new Date(date);
        changedDate.setDate(changedDate.getDate() + days);
    }

    return changedDate;
}

export default addDays;