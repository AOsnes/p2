const {MongoClient, ObjectId} = require('mongodb');
const bodyParser = require('body-parser')
const busboy = require('connect-busboy');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
require('dotenv').config();

const port = process.env.PORT || 5000
const uri = process.env.URI
let connection;
let database;
/* Dont open server connection if we are running tests */
if (process.env.NODE_ENV !== 'test') {
    MongoClient.connect(uri, {useUnifiedTopology: true}, (error, client) => {
        if(error) {
            console.error(error)
        } else{
            connection = client;
            database = connection.db('P2');
            app.listen(port, () => {
                console.log(`Server is listening on port ${port}`);
            });
        }
    })
}

exports.authenticate = async function authenticate(username, password){
    try {
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
exports.getUserinfo = async function getUserinfo(id){
    try {
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

//Cursed crusty code to get the schedule:
//Finds the time interval for the one day view and one week view. Defaults to the next Monday if the date passed is a Saturday or Sunday
let getDateInterval = exports.getDateInterval = function (date, days){
    if (days === '1'){
        if (date.getDay() >= 1 && date.getDay() <= 5){
            let interval = oneDayInterval(date);
            return interval;
        } else {
            //If the date is Saturday or Sunday the date will get changed to Monday in the following week
            date.setDate(date.getDate() + ((date.getDay() === 0) ? 1 : 2));
            let interval = oneDayInterval(date);
            return interval;
        }
    } else {
        if (date.getDay() >= 1 && date.getDay() <= 5) {
            let interval = fiveDayInterval(date);
            return interval;
        } else {
            //If the date is Saturday or Sunday the date will get changed to Monday in the following week
            date.setDate(date.getDate() + ((date.getDay() === 0) ? 1 : 2));
            let interval = fiveDayInterval(date);
            return interval;
        }
    }
}

//Takes the passed date and creates an interval starting at 00:00:00 and ends at 23:59:59
let oneDayInterval = exports.oneDayInterval = function (date){
    let start = new Date(date.getTime());
    start.setHours(0, 0, 0);
    let end = new Date(date.getTime());
    end.setHours(23, 59, 59);
    return {start, end};
}

//Takes the passed date and creates an interval starting at the Monday at 00:00:00 in that week and ends at Friday at 23:59:59 in the same week
 let fiveDayInterval = exports.fiveDayInterval = function (date){
    let start = new Date(date.getTime());
    start.setDate(start.getDate() - (start.getDay() - 1));
    start.setHours(0, 0, 0);
    let end = new Date(date.getTime());
    end.setDate(end.getDate() + (5 - end.getDay()));
    end.setHours(23, 59, 59);
    return {start, end}
}


//This function queries lessons for a given user at a given interval and date
exports.getSchedule = async function getSchedule(user, date, days) {
    try {
        const collection = database.collection("lessons");
        //Calculates the time interval using the passed date and amount of days
        let interval = getDateInterval(date, days);

        let start = interval.start;
        let end = interval.end;
        let cursor;
        let schedule;

        //Determines the role of the user as each role needs a different query to find the correct lessons.
        if (user.role === "teacher") {
            cursor = await collection.find({ "teacherID": user._id.toString(), $and: [{ "startTime": { $gte: start } }, { "endTime": { $lte: end } }] }, { sort: { startTime: 1 } }); 
        } else {
            cursor = await collection.find({ "class": { $in: user.class }, $and: [{ "startTime": { $gte: start } }, { "endTime": { $lte: end } }] }, { sort: { startTime: 1 } });
        }
        schedule = await cursor.toArray();
        await cursor.close();
        return schedule;
    } catch(error){
        throw error;
    }
}

exports.createLesson = async function createLesson(id, className, subject, start, end, description, recurrences, interval){
    return new Promise ((resolve, reject) => {
        try {
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

exports.updateLesson = async function updateLesson(id, changes){
    return new Promise ((resolve, reject) => {
        try {
            const doc = database.collection("lessons");
            doc.updateOne({"_id": ObjectId.createFromHexString(id)}, {$set: changes})
            .then(result => { if (result === null){ throw new Error("No such lesson"); } else { console.log(result) } })
            .catch(console.dir)
            .finally(() => {resolve();});
        } catch(error) {
            throw error;
        }
    });
}

exports.deleteLesson = async function deleteLesson(id){
    return new Promise((resolve, reject) => {
        try {
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

//This function queries assignments for a given user at a 5 day interval and date
exports.getAssignments = async function getAssignments(user, date) {
    try {
        const collection = database.collection("assignments");
        //Calculates the time interval using the passed date and amount of days
        let interval = getDateInterval(date, "5");

        let start = interval.start;
        let end = interval.end;
        let cursor;
        let assignments;

        //Determines the role of the user as each role needs a different query to the correct assignments.
        if (user.role === "teacher") {
            cursor = await collection.find({ "teacherID": user._id,  $and: [{ "dueDate": { $gte: start } }, { "dueDate": { $lte: end } }] }, { sort: { dueDate: 1 } }); 
            assignments = await cursor.toArray();
        } else {
            cursor = await collection.find({ "class": { $in: user.class },  $and: [{ "dueDate": { $gte: start } }, { "dueDate": { $lte: end } }] }, { sort: { dueDate: 1 } });
            assignments = await cursor.toArray();
        }

        //Checks if the query had any results. 
        await cursor.close();
        
        return assignments;

    } catch(error){
        throw error;
    }
}

exports.createAssignment = async function createAssignment(id, lessonID, subject, description, dueDate, optionalFile){
    return new Promise ((resolve, reject) => {
        try {
            const doc = database.collection("assignments");
            doc.insertOne({ "teacherID": id.toString(), "lessonID" : lessonID, "subject": subject, "description": description, "dueDate": dueDate, "fileID": optionalFile, })
            .then(result => console.log(result.insertedCount))
            .then(() => { resolve(); })
            .catch(console.dir);
        } finally {
            // Ensures that the connection will close when you finish/error
            
        }
    });
}

exports.updateAssignment = async function updateAssignment(id, changes){
    return new Promise ((resolve, reject) => {
        try {
            const doc = database.collection("assigments");
            doc.updateOne({"_id": ObjectId.createFromHexString(id)}, {$set: changes})
            .then(result => { if (result === null){ throw new Error("No such lesson"); } else { console.log(result) } })
            .catch(console.dir)
            .finally(() => {resolve();});
        } catch(error) {
            throw error;
        }
    });
}

exports.deleteAssignment = async function deleteAssignment(id){
    return new Promise((resolve, reject) => {
        try {
            const doc = database.collection("assigments");
            doc.deleteOne({ "_id": ObjectId.createFromHexString(id) })
            .then(result => { console.log(result.deletedCount); if (result.deletedCount === 0) { reject(new Error("No such lesson"))}})
            .catch(console.dir)
            .finally(() => { resolve(); });
        } catch (error) {
            throw reject(error);
        }
    });
}

exports.saveFile = async function saveFile(filename){
    return new Promise ((resolve, reject) => {
        const database = client.db('P2');
        let bucket = new GridFSBucket(database);
        let fileID = new ObjectId();
        fs.createReadStream(`${__dirname}/tmp/${filename}`)
        .pipe(bucket.openUploadStreamWithId(fileID, filename))
        .on('error', (error) => reject(new Error(`Lortet virker ikke (╯°□°)╯︵ ┻━┻ ${error}`)))
        .on('finish', () => {console.log("SUCCes"); resolve(fileID)});
    });
}

exports.getFile = async function getFile(fileID){
    let bucket = new GridFSBucket(database);
    let path = `./tmp/${fileID}`
    bucket.openDownloadStream(fileID)
    .pipe(fs.createWriteStream(path))
    .on('error', () => console.log("Lortet virker ikke >:c"))
    .on('finish', () => console.log("SUCCess"));
    return path;
}

let logger = (req, res, next) => {
    console.log(`GOT: ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl} TIME: ${req.requestTime}`);
    next();
}

let requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    next();
}

app.use(bodyParser.json());
app.use(cors());
app.use(busboy());
app.use(requestTime);
app.use(logger);

/* ROUTES */
const classesRouter = require('./routes/classes');
const loginRouter = require('./routes/login');
const userinfoRouter = require('./routes/userinfo');
const scheduleRouter = require('./routes/schedule');
const assignmentsRouter = require('./routes/assignments');
const uploadRouter = require('./routes/upload');
app.use('/classes', classesRouter);
app.use('/login', loginRouter);
app.use('/userinfo', userinfoRouter);
app.use('/schedule', scheduleRouter);
app.use('/assignments', assignmentsRouter);
app.use('/upload', uploadRouter);
