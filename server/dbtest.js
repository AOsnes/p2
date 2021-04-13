const {
    MongoClient
} = require("mongodb");

const uri = "mongodb+srv://sw2b220:sw2b220@cluster0.v3slc.mongodb.net/JaronCeller?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
    useUnifiedTopology: true
});

const testInsert = {
    name: "Asbjørn",
    occupation: "Paycheck thief",
    catchPhrase: "Nogen vil jo mene"
};

async function run() {
    try {
        await client.connect();
        const database = client.db('JaronCeller');


        const cursor = await findData(database, "Test", {});

        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }
        // replace console.dir with your callback to access individual elements
        await cursor.forEach(console.dir);


    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function findData(db, collection, searchParams) {
    const doc = db.collection(collection);
    const result = await doc.find(searchParams);
    return result;
}
//const cursor = await doc.findOne({"name": "Asbjørn"});
//console.log(cursor);

async function getUser(db, name) {
    const doc = db.collection("users");
    const result = await doc.findOne(name);


}

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
        const database = client.db('P2');
        const doc = database.collection("users");
        const result = await doc.findOne({username, password});
        if (result === null) {
            throw "Invalid username or password";
        } else {
            return {
                id: result._id,
                name: result.name,
                role: result.role,
                class: result.class
            };
        }
        //console.log(result);
        //console.log(result._id, result.role, result.class[0]);


    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
let x = 1;

async function insertLessons() {
    try {
        await client.connect();
        const database = client.db('P2');
        const doc = database.collection("lessons");
        const lessonInserts = [{
                "subject": "Engelsk",
                "class": "sw2b2-20",
                "teacherID": "60608f0389177a0bb0679e78",
                "description": "Today we will speak English",
                "startTime": new Date(2020, 3, 12, 9, 30),
                "endTime": new Date(2020, 3, 12, 10, 15)
            },
            {
                "subject": "Dansk",
                "class": "sw2b2-20",
                "teacherID": "60608f0389177a0bb0679e78",
                "description": "Læs bog",
                "startTime": new Date(2020, 3, 12, 8, 45),
                "endTime": new Date(2020, 3, 12, 9, 30)
            },
        ];
        const result = await doc.insertMany(lessonInserts);
        console.dir(result.insertedCount);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function getSchedule(){
    try {
        await client.connect();
        const database = client.db('P2');
        const collection = database.collection("lessons");
        let start = new Date(2020, 3, 5);
        let end = new Date(2020, 3, 9);
        console.log(start + "," + end);
        const cursor = await collection.find({"class": "sw2b2-20", $and: [{"startTime": {$gte : start}}, {"startTime": {$lte : end}}]}, {sort: {startTime: 1}}).toArray();
        console.log(cursor);

        //TODO: fix tid tilbage til lokal tid, fix søgeparameter efter dato og tid


        /*
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
        }
        // replace console.dir with your callback to access individual elements
        await cursor.forEach(console.dir);*/
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }

}

//insertUsers().catch(console.dir);
//insertLessons().catch(console.dir);
//let data = login("test", "test").then(console.log).catch(console.dir);
//let data1 = login("arthur", "password").then(console.log).catch(console.dir);

getSchedule().catch(console.dir);

