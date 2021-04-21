import { MongoClient, ObjectId } from "mongodb";
/* Returns user information if login success else return null */

const uri = process.env.URI;

const client = new MongoClient(uri, {useUnifiedTopology: true});

async function authenticate(username, password){
    try {
        const database = client.db('P2');
        const doc = database.collection("users");
        const result = await doc.findOne({username, password}, {projection: {name: 1, role: 1, class: 1}});
        if (result === null) {
            throw new Error("Invalid username or password");
        } else {
            return result;
        }
    } catch(error) {
        throw error;
    }
}

/* If we already have the ID, we can use this function to get the information about the user
information returned here MUST NOT be confidential! maybe very cursed :)*/
async function getUserinfo(id){
    try {
        const database = client.db('P2');
        const doc = database.collection("users");
        const result = await doc.findOne({"_id": ObjectId(id)}, {projection: {name: 1, role: 1, class: 1}});
        if (result === null) {
            throw new Error("No such id");
        } else {
            return result
        }
    } catch(error) {
        throw error;
    }
}
//Finds the time interval for the one day view and one week view. Defaults to the next monday if the date passed is a Saturday or Sunday
function getDateInterval(date, days){
    if (days === '1'){
        if (date.getDay() >= 1 && date.getDay() <= 5){
            let interval = oneDayInterval(date);
            //console.log("Start: " + interval.start + "\n" + "End: " + interval.end);
            return interval;
        } else {
            date.setDate(date.getDate() + ((date.getDay() === 0) ? 1 : 2));
            let interval = oneDayInterval(date);
            //console.log("Start: " + interval.start + "\n" + "End: " + interval.end);
            return interval;
        }
    } else {
        if (date.getDay() >= 1 && date.getDay() <= 5) {
            let interval = fiveDayInterval(date);
            //console.log("Start: " + interval.start + "\n" + "End: " + interval.end);
            return interval;
        } else {
            date.setDate(date.getDate() + ((date.getDay() === 0) ? 1 : 2));
            let interval = fiveDayInterval(date);
            //console.log("Start: " + interval.start + "\n" + "End: " + interval.end);
            return interval;
        }
    }
}

//Cursed crusty code to get the schedule:
//Takes the passed date and creates an interval starting at 00:00:00 and ends at 23:59:59
function oneDayInterval(date) {
    let start = new Date(date.getTime());
    start.setHours(0, 0, 0);
    let end = new Date(date.getTime());
    end.setHours(23, 59, 59);
    return {start, end};
}

//Takes the passed date and creates an interval starting at the Monday at 00:00:00 in that week and ends at Friday at 23:59:59 in the same week
function fiveDayInterval(date){
    let start = new Date(date.getTime());
    start.setDate(start.getDate() - (start.getDay() - 1));
    start.setHours(0, 0, 0);
    let end = new Date(date.getTime());
    end.setDate(end.getDate() + (5 - end.getDay()));
    end.setHours(23, 59, 59);
    return {start, end}
}


//This function queries lessons for a given user at a given interval and date
async function getSchedule(user, date, days) {
    try {
        /* await client.connect(); */
        const database = client.db('P2');
        const collection = database.collection("lessons");
        //Calculates the time interval using the passed date and amount of days
        let interval = getDateInterval(date, days);

        let start = interval.start;
        let end = interval.end;
        let cursor;
        let schedule;

        //Determines the role of the user as each role needs a different query to the correct lessons.
        if (user.role === "teacher") {
            cursor = await collection.find({ "teacherID": user._id.toString(), $and: [{ "startTime": { $gte: start } }, { "startTime": { $lte: end } }] }, { sort: { startTime: 1 } }); //, $and: [{ "startTime": { $gte: start } }, { "startTime": { $lte: end } }] }, { sort: { startTime: 1 } 
            schedule = await cursor.toArray();
        } else {
            cursor = await collection.find({ "class": { $in: user.class }, $and: [{ "startTime": { $gte: start } }, { "endTime": { $lte: end } }] }, { sort: { startTime: 1 } });
            schedule = await cursor.toArray();
        }

        //Checks if the query had any results. 
        if ((await cursor.count()) === 0) {
            await cursor.close();
            throw new Error("No documents found!")
        } else {
            await cursor.close();
            //MongoDB stores dates in UTC. This loop converts the dates back to local time which is currently UTC + 2.
            for (let lesson of schedule) {
                lesson.startTime += date.getTimezoneOffset();
                lesson.endTime += date.getTimezoneOffset();
            }
            return schedule;
        }
    } catch(error){
        throw error;
    }
}

export default {getSchedule, fiveDayInterval, oneDayInterval, getDateInterval, getUserinfo, authenticate}