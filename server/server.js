const ObjectId = require("mongodb").ObjectId
const { MongoClient } = require("mongodb");
const bodyParser = require('body-parser')
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();
require('dotenv').config();


const port = process.env.PORT || 5000
const uri = process.env.URI;

const client = new MongoClient(uri, {useUnifiedTopology: true});

/* Returns user information if login success else return null */
exports.authenticate = async function authenticate(username, password){
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
exports.getUserinfo = async function getUserinfo(id){
    try {
        const database = client.db('P2');
        const doc = database.collection("users");
        const result = await doc.findOne({"_id": ObjectId(id)}, {projection: {name: 1, role: 1, class: 1}});
        console.log(result)
        if (result === null) {
            throw new Error("No such id");
        } else {
            return result
        }
    } catch(error) {
        throw error;
    }
}

let logger = (req, res, next) => {
    console.log(`GOT: ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl} TIME: ${req.requestTime}`);
    next();
}

let requestTime = (req, res, next) => {
    req.requestTime = Date.now();
    next();
}

let restrict = (req, res, next) => {
    if(req.session.user) {
        next(); //We fine, user is authenticated
    } else {
        req.session.error = 'Access denied';
        res.redirect('/'); //TODO: change?
    }
}

app.use(bodyParser.json());
app.use(cors());
app.use(requestTime);
app.use(logger);

/* ROUTES */
const classesRouter = require('./routes/classes');
const loginRouter = require('./routes/login');
const userinfoRouter = require('./routes/userinfo');
app.use('/classes', classesRouter);
app.use('/login', loginRouter);
app.use('/userinfo', userinfoRouter);

client.connect();

app.listen(port, () =>{
    console.log(`Server is listening on port ${port}`);
});

