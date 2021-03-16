const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://sw2b220:sw2b220@cluster0.v3slc.mongodb.net/JaronCeller?retryWrites=true&w=majority";

const client = new MongoClient(uri, {useUnifiedTopology: true});

const testInsert = {name: "Asbjørn", occupation: "Paycheck thief", catchPhrase: "Nogen vil jo mene"};

async function run() {
    try {
        await client.connect();
        const database = client.db('JaronCeller');
        const doc = database.collection("Test");
        
        //let result = findData(doc);
        const cursor = await doc.findOne({"name": "Asbjørn"});
        console.log(cursor);

        //const result = await doc.insertOne(testInsert);
        //await database.command({ping: 1});
        //console.dir(result.insertedCount);
        /*if ((await cursor.count()) === 0) {
            console.log("No documents found!");
          }
          // replace console.dir with your callback to access individual elements
          await cursor.forEach(console.dir);*/
        
          
    }   finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
  }

async function findData(doc){
    const result = await doc.find({name: "Asbjørn"});
    return result;
}



run().catch(console.dir);