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
const getScheduleRouter = require('./routes/getSchedule');
app.use('/classes', classesRouter);
app.use('/login', loginRouter);
app.use('/userinfo', userinfoRouter);
app.use('/getSchedule', getScheduleRouter);

client.connect()

app.listen(port, () =>{
    console.log(`Server is listening on port ${port}`);
});