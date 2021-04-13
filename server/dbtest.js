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
        await client.close();
    }
}

async function insertLessons() {
    try {
        await client.connect();
        const database = client.db('P2');
        const doc = database.collection("lessons");
        const lessonInserts = [{
                "subject": "Matematik",
                "class": "sw2b2-20",
                "teacherID": "60608f0389177a0bb0679e78",
                "description": "Bare lav avanceret lineær algebra i ikke har lært om lol",
                "startTime": new Date(2021, 3, 12, 12, 00),
                "endTime": new Date(2021, 3, 12, 12, 45)
            },
            {
                "subject": "Dansk",
                "class": "sw2b2-20",
                "teacherID": "60608f0389177a0bb0679e78",
                "description": "Læs bog",
                "startTime": new Date(2021, 3, 12, 12, 45),
                "endTime": new Date(2021, 3, 12, 13, 30)
            },
            {
                "subject": "Engelsk",
                "class": "sw2b2-20",
                "teacherID": "60608f0389177a0bb0679e78",
                "description": "Today we will speak English",
                "startTime": new Date(2021, 3, 12, 9, 30),
                "endTime": new Date(2021, 3, 12, 10, 15)
            },
            {
                "subject": "Dansk",
                "class": "sw2b2-20",
                "teacherID": "60608f0389177a0bb0679e78",
                "description": "Læs bog",
                "startTime": new Date(2021, 3, 12, 8, 45),
                "endTime": new Date(2021, 3, 12, 9, 30)
            },
        ];
        const result = await doc.insertMany(lessonInserts);
        console.dir(result.insertedCount);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

async function getSchedule(user){
    try {
        //await client.connect();
        const database = client.db('P2');
        const collection = database.collection("lessons");
        let start = new Date(2021, 3, 12);
        let end = new Date(2021, 3, 16);
        console.log(start + "," + end);

        const cursor = await collection.find({"class": user.class, $and: [{"startTime": {$gte : start}}, {"startTime": {$lte : end}}]}, {sort: {startTime: 1}});
        let schedule = await cursor.toArray();
        cursor.close();
        //TODO: fix søgeparameter efter dato og tid
        
        if ((await cursor.count()) === 0) {
            console.log("No documents found!");
            return schedule;
        } else {
            let date = new Date();
            for (lesson of schedule){
                lesson.startTime += date.getTimezoneOffset();
                lesson.endTime += date.getTimezoneOffset();
            }
            return schedule;
        }
        // replace console.dir with your callback to access individual elements
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }

}

//insertUsers().catch(console.dir);
//insertLessons().catch(console.dir);
//let data = login("test", "test").then(console.log).catch(console.dir);
await client.connect();
let data1 = login("arthur", "password").then(result => getSchedule(result)).catch(console.dir);

//getSchedule({"class": "sw2b2-20"}).then(console.log).catch(console.dir);

