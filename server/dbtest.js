const {MongoClient, GridFSBucket} = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
let fs = require('fs');

require('dotenv').config();

const uri = process.env.URI;
//console.log(uri);
const client = new MongoClient(uri, {
    useUnifiedTopology: true
});

async function insertUsers() {
    try {
        await client.connect();
        const database = client.db('P2');
        const doc = database.collection("users");
        const userInserts = [{
                "username": "jaron",
                "password": "celler",
                "name": "Jaron Celler",
                "role": "student",
                "class": ["sw2b2-21"]
            },
            {
                "username": "brian",
                "password": "password",
                "name": "Brain",
                "role": "student",
                "class": ["sw2b2-22"]
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
        //await client.close()qqqq
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
                "startTime": new Date(2021, 3, 19, 12, 00),
                "endTime": new Date(2021, 3, 19, 12, 45)
            },
            {
                "subject": "Dansk",
                "class": "sw2b2-22",
                "teacherID": "60608f0389177a0bb0679e78",
                "description": "Læs bog",
                "startTime": new Date(2021, 3, 20, 12, 45),
                "endTime": new Date(2021, 3, 20, 13, 30)
            },
            {
                "subject": "Engelsk",
                "class": "sw2b2-22",
                "teacherID": "60608f0389177a0bb0679e78",
                "description": "Today we will speak English",
                "startTime": new Date(2021, 3, 21, 9, 30),
                "endTime": new Date(2021, 3, 21, 10, 15)
            },
            {
                "subject": "Dansk",
                "class": "sw2b2-22",
                "teacherID": "60608f0389177a0bb0679e78",
                "description": "Læs bog",
                "startTime": new Date(2021, 3, 22, 8, 45),
                "endTime": new Date(2021, 3, 22, 9, 30)
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
        let lessonCount = await cursor.count();
        await cursor.close();
        if (lessonCount === 0) {
            console.log("No documents found!");
            return schedule;
        } else {
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


async function createLesson(id, className, subject, start, end, description, recurrences, interval){
    return new Promise ((resolve, reject) => {
        try {
            //await client.connect();
            const database = client.db('P2');
            const doc = database.collection("lessons");
            let result;
            if (recurrences > 1){
                let lessonInserts = [];
    
                for (let i = 0; i < recurrences; i++){
                    let start1 = new Date(start);
                    let end1 = new Date(end);
                    start1.setDate(start1.getDate() + i * interval);
                    end1.setDate(end1.getDate() + i * interval);
    
                    lessonInserts[i] = {
                        "subject": subject,
                        "class": className,
                        "teacherID": id.toString(),
                        "description": description,
                        "startTime": start1,
                        "endTime": end1,
                    }
                }
                //console.log(lessonInserts);
                doc.insertMany(lessonInserts)
                .then(result => console.log(result.insertedCount))
                .catch(console.dir);
    
            } else {
                //result = await doc.insertOne({"subject": subject, "class": className, "teacherID": id.toString(), "description": description, "startTime": start, "endTime": end,});
                doc.insertOne({"subject": subject, "class": className, "teacherID": id.toString(), "description": description, "startTime": start, "endTime": end,})
                .then(result => console.log(result.insertedCount))
                .catch(console.dir)
                .finally(() => {resolve();});
            }
        } finally {
            // Ensures that the client will close when you finish/error
            
        }
    });
}

async function updateLesson(id, changes){
    return new Promise ((resolve, reject) => {
        try {
            const database = client.db('P2');
            const doc = database.collection("lessons");
            //const result = await doc.updateOne({"_id": ObjectId.createFromHexString(id)}, {$set: changes});
            doc.updateOne({"_id": ObjectId.createFromHexString(id)}, {$set: changes})
            .then(result => { if (result === null){ throw new Error("No such lesson"); } else { console.log(result) } })
            .catch(console.dir)
            .finally(() => {resolve();});
        } catch(error) {
            throw error;
        }
    });
}

async function deleteLesson(id){
    return new Promise((resolve, reject) => {
        try {
            const database = client.db('P2');
            const doc = database.collection("lessons");
            doc.deleteOne({ "_id": ObjectId.createFromHexString(id) })
            .then(result => { console.log(result.deletedCount); if (result.deletedCount === 0) { throw new Error("No such lesson") } })
            .catch(console.dir)
            .finally(() => { resolve(); });
        } catch (error) {
            throw error;
        }
    });
}


async function saveFile(){
    await client.connect();
    const database = client.db('P2');
    let bucket = new GridFSBucket(database);
    fs.createReadStream('../JaronCeller.png')
    .pipe(bucket.openUploadStream('.jaronceller.png'))
    .on('error', () => console.log("Lortet virker ikke >:c"))
    .on('finish', () => console.log("SUCCess"));

}

async function getFile(){
    await client.connect();
    const database = client.db('P2');
    let bucket = new GridFSBucket(database);
    bucket.openDownloadStreamByName('.jaronceller.png')
    .pipe(fs.createWriteStream('./jaronceller.png'))
    .on('error', () => console.log("Lortet virker ikke >:c"))
    .on('finish', () => console.log("SUCCess"));

}



//getFile().then(console.log("Pog"));

//updateLesson("6082ab7a6151ce1530d207ba", {"subject": "CS"}).catch(console.dir);
//deleteLesson("6082ab7a6151ce1530d207bd").catch(console.dir);
//login("test", "test").then(result => createLesson(result._id, "sw2b2-20", "N/T", new Date(2021, 4, 5, 12, 45, 0), new Date(2021, 4, 5, 13, 30, 0), "I hate jews so much it's unreal. Love from Kazakhstan", 1, 7)).catch(console.dir);




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



login("test", "test").then(result => getSchedule(result, new Date(2021, 4, 5), 5)).then(console.log).catch(console.dir);
//console.log(new Date().toLocaleDateString());
//let string = new Date().toLocaleDateString();
//console.log(string);
//let newDate = new Date(string);
//console.log(newDate);


//getDateInterval(date, 5);


//getSchedule({"class": "sw2b2-20"}).then(console.log).catch(console.dir);

