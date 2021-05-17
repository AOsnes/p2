/* Beregn hvor stor højde der skal være på elemented ud fra end time - start time,*/
function calculateHeight(startTime, endTime){
    /* This is how long every class is in milliseconds */
    let deltaTime = endTime - startTime;
    
    /* One hour is 81.25 px, change this to change the size of the classes */
    let scale = 81.25;
    /* We calculate how many hours the deltaTime translates to and we multiply it with the scale */
    let height = deltaTime / 1000000 / 3.6 * scale;
    return `${height}px`;
}

export default calculateHeight;