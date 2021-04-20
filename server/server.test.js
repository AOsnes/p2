const ObjectId = require("mongodb").ObjectId
const { MongoClient } = require("mongodb");
require('dotenv').config();
const uri = process.env.URI;
const client = new MongoClient(uri, {useUnifiedTopology: true});


test('this should work i guess?', () =>{
    
    expect(1+1).toBe(2);
})