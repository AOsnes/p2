const { MongoClient } = require("mongodb");
const express = require('express');
const app = express();

const port = process.env.PORT || 5000
const uri = "mongodb+srv://sw2b220:sw2b220@cluster0.v3slc.mongodb.net/JaronCeller?retryWrites=true&w=majority";

const client = new MongoClient(uri, {useUnifiedTopology: true});

const testInsert = {name: "Asbjørn", occupation: "Paycheck thief", catchPhrase: "Nogen vil jo mene"};

async function run() {
    try {
        await client.connect();
        const database = client.db('JaronCeller');


        const cursor = await findData(database, "Test", {} );

        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }
        // replace console.dir with your callback to access individual elements
        await cursor.forEach(console.dir);


    }   finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function findData(db, collection, searchParams){
    const doc = db.collection(collection);
    const result = await doc.find(searchParams);
    return result;
}
        //const cursor = await doc.findOne({"name": "Asbjørn"});
        //console.log(cursor);

async function getSchedule(){
    try {
        await client.connect();
        const database = client.db('JaronCeller');




    }   finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }


}

async function getUser(db, name){
    const doc = db.collection("Users");
    const result = await doc.findOne(name);
    

}

async function insertUsers(){
    try {
        
        const database = client.db('JaronCeller');
        const doc = database.collection("Users");
        const userInserts = [
            {"username": "test", "password": "test", "name":"Testy McTestFace", "role":"teacher", "class": ["sw2b2-20","sw2b2-21","sw2b2-22"]},
            {"username": "arthur", "password": "password", "name":"Arthur", "role":"student", "class": ["sw2b2-20"]},
        ];
        const result = await doc.insertMany(userInserts);
        console.dir(result.insertedCount);
    }   finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }

}


module.exports = async function login(username, password){
    try {
        const database = client.db('JaronCeller');
        const doc = database.collection("Users");
        const result = await doc.findOne({username, password});
        if (result === null) {
            throw "Invalid username or password";
        } else {
            return {id: result._id, name: result.name, role: result.role, class: result.class};
        } 
        console.log(result);
        //console.log(result._id, result.role, result.class[0]);


    }   finally {
        // Ensures that the client will close when you finish/error
    }

}



//insertUsers().catch(console.dir);

//ROUTES
const classesRouter = require('./routes/classes');
const loginRouter = require('./routes/login');
app.use('/classes', classesRouter);
app.use('/login', loginRouter);

client.connect();

app.listen(port, () =>{
    console.log(`Server is listening on port ${port}`)
})

