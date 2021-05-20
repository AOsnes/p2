function formatDate(year, month, day){
    let yearFormatted = year;
    let monthFormatted = month < 10 ? '0' + month : month;
    let dayFormatted = day < 10 ? '0' + day : day;
    return `${yearFormatted}-${monthFormatted}-${dayFormatted}`;
}

export default formatDate;