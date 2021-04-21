//const ObjectId = require("mongodb").ObjectId
//const { MongoClient } = require("mongodb");
//require('dotenv').config();
//const uri = process.env.URI;
//const client = new MongoClient(uri, {useUnifiedTopology: true});
//const {getUserinfo, getSchedule, getDateInterval, oneDayInterval, fiveDayInterval} = require('./server');
import {getUserinfo, getSchedule, oneDayInterval, fiveDayInterval, getDateInterval} from './util';


test('oneDayIntervalMonday', () =>{
    let start = new Date(2021, 3, 19, 0, 0, 0);
    let end = new Date(2021, 3, 19, 23, 59, 59);
    let expectedObject = {start, end};
    expect(oneDayInterval(new Date (2021, 3, 19))).toEqual(expectedObject);
})

test('oneDayIntervalTuesday', () =>{
    let start = new Date(2021, 3, 20, 0, 0, 0);
    let end = new Date(2021, 3, 20, 23, 59, 59);
    let expectedObject = {start, end};
    expect(oneDayInterval(new Date (2021, 3, 20))).toEqual(expectedObject);
})

test('oneDayIntervalWednesday', () =>{
    let start = new Date(2021, 3, 21, 0, 0, 0);
    let end = new Date(2021, 3, 21, 23, 59, 59);
    let expectedObject = {start, end};
    expect(oneDayInterval(new Date (2021, 3, 21))).toEqual(expectedObject);
})

test('oneDayIntervalThursday', () =>{
    let start = new Date(2021, 3, 22, 0, 0, 0);
    let end = new Date(2021, 3, 22, 23, 59, 59);
    let expectedObject = {start, end};
    expect(oneDayInterval(new Date (2021, 3, 22))).toEqual(expectedObject);
})

test('oneDayIntervalFriday', () =>{
    let start = new Date(2021, 3, 23, 0, 0, 0);
    let end = new Date(2021, 3, 23, 23, 59, 59);
    let expectedObject = {start, end};
    expect(oneDayInterval(new Date (2021, 3, 23))).toEqual(expectedObject);
})

test('fiveDayIntervalMonday', () =>{
    let start = new Date(2021, 3, 19, 0, 0, 0);
    let end = new Date(2021, 3, 23, 23, 59, 59);
    let expectedObject = {start, end};
    expect(fiveDayInterval(new Date (2021, 3, 19))).toEqual(expectedObject);
})

test('fiveDayIntervalTuesday', () =>{
    let start = new Date(2021, 3, 19, 0, 0, 0);
    let end = new Date(2021, 3, 23, 23, 59, 59);
    let expectedObject = {start, end};
    expect(fiveDayInterval(new Date (2021, 3, 20))).toEqual(expectedObject);
})

test('fiveDayIntervalWednesday', () =>{
    let start = new Date(2021, 3, 19, 0, 0, 0);
    let end = new Date(2021, 3, 23, 23, 59, 59);
    let expectedObject = {start, end};
    expect(fiveDayInterval(new Date (2021, 3, 21))).toEqual(expectedObject);
})

test('fiveDayIntervalThursday', () =>{
    let start = new Date(2021, 3, 19, 0, 0, 0);
    let end = new Date(2021, 3, 23, 23, 59, 59);
    let expectedObject = {start, end};
    expect(fiveDayInterval(new Date (2021, 3, 22))).toEqual(expectedObject);
})

test('fiveDayIntervalFriday', () =>{
    let start = new Date(2021, 3, 19, 0, 0, 0);
    let end = new Date(2021, 3, 23, 23, 59, 59);
    let expectedObject = {start, end};
    expect(fiveDayInterval(new Date (2021, 3, 23))).toEqual(expectedObject);
})

/* Same as above??!?
test('fiveDayIntervalFriday', () =>{
    let start = new Date(2021, 3, 19, 0, 0, 0);
    let end = new Date(2021, 3, 23, 23, 59, 59);
    let expectedObject = {start, end};
    expect(fiveDayInterval(new Date (2021, 3, 23))).toEqual(expectedObject);
}) */


test('getDateIntervalMonday1', () =>{
    let start = new Date(2021, 3, 19, 0, 0, 0);
    let end = new Date(2021, 3, 19, 23, 59, 59);
    let expectedObject = {start, end};
    let testTime = new Date (2021, 3, 19);
    expect(getDateInterval(testTime, '1')).toEqual(expectedObject);
})








