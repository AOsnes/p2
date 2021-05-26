const {MongoClient, ObjectId, GridFSBucket} = require('mongodb');
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

//Handles login and queries the user
exports.authenticate = async function authenticate(username, password){
    try {
        const doc = database.collection("users");
        //Queries the user using username and password. Uses a projection to ensure that the username and password are not returned from the query
        const result = await doc.findOne({$and: [{"username": username}, {"password": password}]}, {projection: {name: 1, role: 1, class: 1}}); 
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
let getUserinfo = exports.getUserinfo = async function getUserinfo(id){
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
    //Checks if the interval is one day. Anything else is assumed to be a request for five day interval.
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
    let start = new Date(date); //Makes a copy of the passed date object
    start.setHours(0, 0, 0);
    let end = new Date(date);
    end.setHours(23, 59, 59);
    return {start, end};//Object is returned to return multiple values
}

//Takes the passed date and creates an interval starting at the Monday at 00:00:00 in that week and ends at Friday at 23:59:59 in the same week
 let fiveDayInterval = exports.fiveDayInterval = function (date){
    let start = new Date(date); //Makes a copy of the passed date object
    start.setDate(start.getDate() - (start.getDay() - 1)); //What even is JS? Sets the date to the current date and subtracts the weekday(0-6) - 1 as Sunday is 0 indexed. This results in Monday being set.
    start.setHours(0, 0, 0);
    let end = new Date(date);
    end.setDate(end.getDate() + (5 - end.getDay())); //Sets the date to the current date and adds 5 - weekday(0-6) as Friday is index 5. This results in Friday being set. 
    end.setHours(23, 59, 59);
    return {start, end} //Object is returned to return multiple values
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
            cursor = await collection.find({ "teacherID": user._id, $and: [{ "startTime": { $gte: start } }, { "endTime": { $lte: end } }] }, { sort: { startTime: 1 } }); 
        } else {
            cursor = await collection.find({ "class": { $in: user.class }, $and: [{ "startTime": { $gte: start } }, { "endTime": { $lte: end } }] }, { sort: { startTime: 1 } });
        }
        //Turns the cursor into an array and closes the cursor to free up DB resources and server resources before returning the array
        schedule = await cursor.toArray();
        await cursor.close();
        return schedule;
    } catch(error){
        throw error;
    }
}

//Inserts a lesson document into the database with the relevant attributes. The promise resolves with the Id of the inserted document. 
exports.createLesson = async function createLesson(id, className, subject, start, end, description, fileId){
    return new Promise ((resolve, reject) => {
        try {
            const doc = database.collection("lessons");
            doc.insertOne({"subject": subject, "class": className, "teacherID": id, "description": description, "fileId": fileId, "startTime": start, "endTime": end,})
            .then(result => resolve({id: result.insertedId}))
            .catch((error) => reject(new Error(error)));
        } catch(error){
            reject(new Error(error))
        }
    });
}

//Updates a lesson by querying by the Primary Key and changes the attributes of the document specified in the changes object passed. 
//Resolves with the changed result or rejects if no document exists with the passed Id
exports.updateLesson = async function updateLesson(id, changes){
    return new Promise ((resolve, reject) => {
        try {
            const doc = database.collection("lessons");
            doc.updateOne({"_id": ObjectId.createFromHexString(id)}, {$set: changes})
            .then(result =>{
                if(result === null){
                    reject(new Error("No such lesson"))
                } else {
                    resolve(result)
                }})
            .catch(reason => reject(reason))
        } catch(error) {
            reject(error)
        }
    });
}

//Deletes a lesson by querying by the Priamary Key
exports.deleteLesson = async function deleteLesson(id){
    return new Promise((resolve, reject) => {
        try {
            const doc = database.collection("lessons");
            doc.deleteOne({ "_id": ObjectId.createFromHexString(id)})
            .then(result => {
                if (result.deletedCount === 0){
                    reject(new Error("No such lesson")) 
                } else {
                    resolve(result.deletedCount)
                }
            })
            .catch(error => reject(error))
        } catch (error) {
            reject(error)
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
        } else {
            cursor = await collection.find({ "class": { $in: user.class },  $and: [{ "dueDate": { $gte: start } }, { "dueDate": { $lte: end } }] }, { sort: { dueDate: 1 } });
        }

        //Turns the cursor into an array and closes the cursor to free up DB resources and server resources before returning the array
        assignments = await cursor.toArray();
        await cursor.close();
        return assignments;

    } catch(error){
        throw error;
    }
}

let getAssignmentInfo = exports.getAssignmentInfo = async function(assignmentId){
    return new Promise((resolve, reject) =>{
        try{
            const doc = database.collection("assignments");
            doc.findOne({"_id": assignmentId}, {projection: {subject: 1, description: 1}})
            .then(result => resolve(result))
            .catch(error => reject(error))
        } catch(error) {
            reject(error)
        }
    })
}

//Inserts a document into the assignments collection with the passed attributes. Resolves with the inserted count.
exports.createAssignment = async function createAssignment(teacherID, lessonID, subject, description, className, dueDate, optionalFile){
    return new Promise ((resolve, reject) => {
        try {
            const doc = database.collection("assignments");
            doc.insertOne({ "teacherID": teacherID, "lessonID" : lessonID, "subject": subject, "description": description, "class": className,"dueDate": dueDate, "fileId": optionalFile, })
            .then(result => resolve(result.insertedCount))
            .catch(error => reject(error));

        } catch(error){
            reject(error);
        }
    });
}

//Updates an assignment by querying by the Primary Key and changes the attributes of the document specified in the changes object passed. 
//Resolves with the changed result or rejects if no document exists with the passed Id
exports.updateAssignment = async function updateAssignment(id, changes){
    return new Promise ((resolve, reject) => {
        try {
            const doc = database.collection("assignments");
            doc.updateOne({"_id": ObjectId.createFromHexString(id)}, {$set: changes})
            .then(result => { if (result === null){ throw new Error("No such lesson"); } else { console.log(result.modifiedCount) } })
            .catch(console.dir)
            .finally(() => {resolve();});
        } catch(error) {
            reject(error);
        }
    });
}

//Deletes a lesson by querying by the Priamary Key
exports.deleteAssignment = async function deleteAssignment(id){
    return new Promise((resolve, reject) => {
        try {
            const doc = database.collection("assignments");
            doc.deleteOne({ "_id": ObjectId.createFromHexString(id) })
            .then(result => { console.log(result.deletedCount); if (result.deletedCount === 0) { reject(new Error("No such lesson"))}})
            .catch(console.dir)
            .finally(() => { resolve(); });
        } catch (error) {
            throw reject(error);
        }
    });
}

//Turns in an assignment with the required attributes
exports.turnInAssignment = async function turnInAssignment(assignmentId, studentId, fileId){
    return new Promise ((resolve, reject) => {
        try {
            const doc = database.collection("turnedInAssignments");
            doc.insertOne({ "assignmentId": ObjectId(assignmentId), "studentId" : ObjectId(studentId), "fileId": ObjectId(fileId), "timeStamp": new Date(), "feedbackFileId": null, "reaction": null})
            .then(result => resolve(result.insertedCount))
            .catch(error => reject(error));
        } catch(error) {
            reject(error);
        }
    });
}

/* If userId is that of a teacher, assignmentId cannot be undefined */
exports.getTurnedInAssignments = async function getTurnedInAssignments(userId, assignmentId){
    return new Promise ((resolve, reject) => {
        try {
            getUserinfo(userId).then(user =>{
                const doc = database.collection("turnedInAssignments");
                let promises = [];
                if(user.role === "teacher"){
                    let cursor = doc.find({"assignmentId": ObjectId(assignmentId)});
                    cursor.toArray().then(result =>{
                        cursor.close();
                        result.forEach(result => {
                            promises.push(
                                getUserinfo(result.studentId).then(user => {
                                result.name = user.name;
                                return result;
                            }))
                        });
                        Promise.all(promises).then((result) =>{
                            resolve(result)
                        })
                    })
                } else {
                    let cursor = doc.find({"studentId": ObjectId(userId)})
                    cursor.toArray().then(result =>{
                        cursor.close();
                        result.forEach(result => {
                            promises.push(
                                getAssignmentInfo(result.assignmentId).then(assignment => {
                                result.subject = assignment.subject;
                                result.description = assignment.description;
                                return result;
                            }))
                        });
                        Promise.all(promises).then((result) =>{
                            resolve(result)
                        })
                    })
                }
            })
        } catch(error) {
            reject(error);
        }
    });
}

exports.updateTurnedInAssignment = async function updateTurnedInAssignment(id, changes){
    return new Promise ((resolve, reject) => {
        try {
            const doc = database.collection("turnedInAssignments");
            doc.updateOne({"_id": ObjectId.createFromHexString(id)}, {$set: changes})
            .then(result => {
                resolve(result.modifiedCount)
            })
            .catch(error => reject(error));
        } catch(error) {
            reject(error);
        }
    });
}

//Saves a file in the database. Resolves with the id of the document in the fs.files collection.
exports.saveFile = async function saveFile(filename){
    return new Promise ((resolve, reject) => {
        let bucket = new GridFSBucket(database); 
        let fileId = new ObjectId(); //Generates an ObjectId for the document instead of letting the database generate it. This makes it easier to return to other functions as GridFS does not provide an easy way to get the _id after uploading. 
        fs.createReadStream(`${__dirname}/tmp/${filename}`) //Reads the file that has to be uploaded from the tmp directory
        .pipe(bucket.openUploadStreamWithId(fileId, filename)) //Uploads the file to MongoDB with the generated id and filename.
        .on('error', (error) => reject(new Error(`Lortet virker ikke (╯°□°)╯︵ ┻━┻ ${error}`)))
        .on('finish', () => resolve(fileId));
    });
}

//Downloads a file from the database. Resolves with the path of the file in the tmp directory.
exports.getFile = async function getFile(fileId, filename){
    return new Promise((resolve, reject) => {
        let bucket = new GridFSBucket(database);
        let path = `./tmp/${filename}`;
        bucket.openDownloadStream(fileId) //Downloads the file with the passed id
        .pipe(fs.createWriteStream(path)) //Writes the file in the tmp directory with the correct file name and file extension.
        .on('error', (error) => reject(new Error(`Lortet virker ikke (╯°□°)╯︵ ┻━┻ ${error}`)))
        .on('finish', () => resolve(path)); 
    });
}

//Queries the filename from the Primary Key of the collection.
exports.getFilename = async function getFilename(fileID){
    const doc = database.collection("fs.files");
    let result = await doc.findOne({"_id": fileID}, {projection: {_id: 0, filename: 1}});
    return result.filename;
}

//Logs the request method, the request, and time of the request.
let logger = (req, res, next) => {
    console.log(`GOT: ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl} TIME: ${req.requestTime}`);
    next();
}

//Gets the current time
let requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    next();
}

//Sigurd, det kunne være rimelig pog hvis du kommenterede det her
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
const downloadRouter = require('./routes/download');
const feedbackRouter = require('./routes/feedback');
app.use('/classes', classesRouter);
app.use('/login', loginRouter);
app.use('/userinfo', userinfoRouter);
app.use('/schedule', scheduleRouter);
app.use('/assignments', assignmentsRouter);
app.use('/upload', uploadRouter);
app.use('/download', downloadRouter);
app.use('/feedback', feedbackRouter);
