const router = require('express').Router();
const { MongoClient } = require("mongodb");
const assert = require('assert');

//TODO: Lav .env fil
const uri = "mongodb+srv://sw2b220:sw2b220@cluster0.v3slc.mongodb.net/JaronCeller?retryWrites=true&w=majority";

const client = new MongoClient(uri, {useUnifiedTopology: true});

router.route('/').get((req, res) =>{
    //TODO: connect to mongodb and get the content
    try {
        client.connect((error, client) =>{
            if (error != null) throw error;
            //Måske behøves det her ikke
            const database = client.db('JaronCeller');
            const doc = database.collection("Test");
        
            //let result = findData(doc);
            doc.findOne({"name": "Asbjørn"}, (error, cursor) =>{
                if (error != null) throw error;
                //res.json(cursor)
                console.log(cursor);
            });
        })
    } catch(error){
        console.log(error)
    } finally {
        client.close();
    }
});

router.route('/add').post((req, res) => {
    //TODO: Connect to mongodb and add the content
});

module.exports = router;