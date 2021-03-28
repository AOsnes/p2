const { MongoClient } = require("mongodb");

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



run().catch(console.dir);



