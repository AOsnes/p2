const { MongoClient } = require("mongodb");
const bodyParser = require('body-parser')
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();


const port = process.env.PORT || 5000
const uri = "mongodb+srv://sw2b220:sw2b220@cluster0.v3slc.mongodb.net/JaronCeller?retryWrites=true&w=majority";

const client = new MongoClient(uri, {useUnifiedTopology: true});

/* Returns user information if login success else return null */
module.exports = async function authenticate(username, password){
    try {
        const database = client.db('JaronCeller');
        const doc = database.collection("Users");
        const result = await doc.findOne({username, password});
        if (result === null) {
            throw "Invalid username or password";
        } else {
            return {id: result._id, name: result.name, role: result.role, class: result.class};
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

//ROUTES
const classesRouter = require('./routes/classes');
const loginRouter = require('./routes/login');
app.use('/classes', classesRouter);
app.use('/login', loginRouter);

client.connect();

app.listen(port, () =>{
    console.log(`Server is listening on port ${port}`);
});

