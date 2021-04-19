const {MongoClient} = require("mongodb");

const uri = process.env.URI;

const client = new MongoClient(uri, {
    useUnifiedTopology: true
});

async function insertUsers() {
    try {
        await client.connect();
        const database = client.db('P2');
        const doc = database.collection("users");
        const userInserts = [{
                "username": "admin",
                "password": "admin",
                "name": "admin",
                "role": "teacher",
                "class": ["sw2b2-20", "sw2b2-21", "sw2b2-22"]
            },
            {
                "username": "arthur",
                "password": "password",
                "name": "Arthur",
                "role": "student",
                "class": ["sw2b2-20"]
            },
        ];
        const result = await doc.insertMany(userInserts);
        console.dir(result.insertedCount);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }

}


async function login(username, password) {
    try {
        await client.connect();
        //await client.connect();
        const database = client.db('P2');
        const doc = database.collection("users");
        const result = await doc.findOne({username, password}, {projection: {name: 1, role: 1, class: 1}});
        if (result === null) {
            throw "Invalid username or password";
        } else {
            return result;
        }

    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}

async function insertLessons() {
    try {
        await client.connect();
        const database = client.db('P2');
        const doc = database.collection("lessons");
        const lessonInserts = [{
                "subject": "Matematik",
                "class": "sw2b2-21",
                "teacherID": "60608f0389177a0bb0679e78",
                "description": "Bare lav avanceret lineær algebra i ikke har lært om lol",
                "startTime": new Date(2021, 3, 13, 12, 00),
                "endTime": new Date(2021, 3, 13, 12, 45)
            },
            {
                "subject": "Dansk",
                "class": "sw2b2-22",
                "teacherID": "60608f0389177a0bb0679e78",
                "description": "Læs bog",
                "startTime": new Date(2021, 3, 13, 12, 45),
                "endTime": new Date(2021, 3, 13, 13, 30)
            },
            {
                "subject": "Engelsk",
                "class": "sw2b2-22",
                "teacherID": "60608f0389177a0bb0679e78",
                "description": "Today we will speak English",
                "startTime": new Date(2021, 3, 13, 9, 30),
                "endTime": new Date(2021, 3, 13, 10, 15)
            },
            {
                "subject": "Dansk",
                "class": "sw2b2-22",
                "teacherID": "60608f0389177a0bb0679e78",
                "description": "Læs bog",
                "startTime": new Date(2021, 3, 13, 8, 45),
                "endTime": new Date(2021, 3, 13, 9, 30)
            },
        ];
        const result = await doc.insertMany(lessonInserts);
        console.dir(result.insertedCount);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

//This function queries lessons for a given user at a given interval and date
async function getSchedule(user, date, days) {
    try {
        //await client.connect();
        console.log(user);
        const database = client.db('P2');
        const collection = database.collection("lessons");
        //Calculates the time interval using the passed date and amount of days
        interval = getDateInterval(date, days);

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
            console.log("No documents found!");
            await cursor.close();
            return schedule;
        } else {
            await cursor.close();
            //MongoDB stores dates in UTC. This loop converts the dates back to local time which is currently UTC + 2.
            for (lesson of schedule) {
                lesson.startTime += date.getTimezoneOffset();
                lesson.endTime += date.getTimezoneOffset();
            }
            return schedule;
        }
    } finally {
        await client.close();
    }
}

//Finds the time interval for the one day view and one week view. Defaults to the next monday if the date passed is a Saturday or Sunday
function getDateInterval(date, days){
    if (days === 1){
        if (date.getDay() >= 1 && date.getDay() <= 5){
            let interval = oneDayInterval(date);
            console.log("Start: " + interval.start + "\n" + "End: " + interval.end);
            return interval;
        } else {
            date.setDate(date.getDate() + ((date.getDay() === 0) ? 1 : 2));
            let interval = oneDayInterval(date);
            console.log("Start: " + start + "\n" + "End: " + end);
            return interval;
        }
    } else {
        if (date.getDay() >= 1 && date.getDay() <= 5) {
            let interval = fiveDayInterval(date);
            console.log("Start: " + interval.start + "\n" + "End: " + interval.end);
            return interval;
        } else {
            date.setDate(date.getDate() + ((date.getDay() === 0) ? 1 : 2));
            let interval = fiveDayInterval(date);
            console.log("Start: " + interval.start + "\n" + "End: " + interval.end);
            return interval;
        }
    }
}

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



//insertUsers().catch(console.dir);
//insertLessons().catch(console.dir);
//let data = login("test", "test").then(console.log).catch(console.dir);

//Lav function der kan konvertere new Date() til start og slutning på ugen
//let start = new Date(2021, 3, 12);
//let end = new Date(2021, 3, 16);
//console.log("Start: " + start.getDay() + "\nEnd: " + end.getDay());
//getDateInterval(new Date(2021, 3, 17), 1);
/*let date = new Date();
console.log(date);
let nextDay = new Date(date.getTime());
nextDay.setDate(nextDay.getDate() + 1);
console.log(nextDay);*/



//login("test", "test").then(result => getSchedule(result, new Date(2021, 3, 16), 5)).then(console.log).catch(console.dir);
//console.log(new Date().toLocaleDateString());
let string = new Date().toLocaleDateString();
console.log(string);
let newDate = new Date(string);
console.log(newDate);

//let date = new Date();
//getDateInterval(date, 5);


//getSchedule({"class": "sw2b2-20"}).then(console.log).catch(console.dir);

