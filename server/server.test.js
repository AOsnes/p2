import {oneDayInterval, fiveDayInterval, getDateInterval} from './server';

describe('Server tests', () =>{
    describe('oneDayInterval tests', () =>{
        test.each([
            ["Monday",    new Date(2021, 3, 19), {"end": new Date(2021, 3, 19, 23, 59, 59), "start": new Date(2021, 3, 19, 0, 0, 0)} ],
            ["Tuesday",   new Date(2021, 3, 20), {"end": new Date(2021, 3, 20, 23, 59, 59), "start": new Date(2021, 3, 20, 0, 0, 0)} ],
            ["Wednesday", new Date(2021, 3, 21), {"end": new Date(2021, 3, 21, 23, 59, 59), "start": new Date(2021, 3, 21, 0, 0, 0)} ],
            ["Thursday",  new Date(2021, 3, 22), {"end": new Date(2021, 3, 22, 23, 59, 59), "start": new Date(2021, 3, 22, 0, 0, 0)} ],
            ["Friday",    new Date(2021, 3, 23), {"end": new Date(2021, 3, 23, 23, 59, 59), "start": new Date(2021, 3, 23, 0, 0, 0)} ],
        ])('#%# oneDayInterval %s', (formattet, date, expected) => {
            expect(oneDayInterval(date)).toStrictEqual(expected);
        });
    })

    describe('fiveDayInterval tests', () =>{
        test.each([
            ["Monday",    new Date(2021, 3, 19), {"end": new Date(2021, 3, 23, 23, 59, 59), "start": new Date(2021, 3, 19, 0, 0, 0)} ],
            ["Tuesday",   new Date(2021, 3, 20), {"end": new Date(2021, 3, 23, 23, 59, 59), "start": new Date(2021, 3, 19, 0, 0, 0)} ],
            ["Wednesday", new Date(2021, 3, 21), {"end": new Date(2021, 3, 23, 23, 59, 59), "start": new Date(2021, 3, 19, 0, 0, 0)} ],
            ["Thursday",  new Date(2021, 3, 22), {"end": new Date(2021, 3, 23, 23, 59, 59), "start": new Date(2021, 3, 19, 0, 0, 0)} ],
            ["Friday",    new Date(2021, 3, 23), {"end": new Date(2021, 3, 23, 23, 59, 59), "start": new Date(2021, 3, 19, 0, 0, 0)} ],
        ])('#%# fiveDayInterval %s', (formattet, date, expected) => {
            expect(fiveDayInterval(date)).toStrictEqual(expected);
        });
    })

    describe('getDateInterval tests', () =>{
        test.each([
            ["Monday",    '1', new Date(2021, 3, 19), {"end": new Date(2021, 3, 19, 23, 59, 59), "start": new Date(2021, 3, 19, 0, 0, 0)} ],
            ["Friday",    '1', new Date(2021, 3, 23), {"end": new Date(2021, 3, 23, 23, 59, 59), "start": new Date(2021, 3, 23, 0, 0, 0)} ],
            ["Saturday",  '1', new Date(2021, 3, 24), {"end": new Date(2021, 3, 26, 23, 59, 59), "start": new Date(2021, 3, 26, 0, 0, 0)} ],
            ["Sunday",    '1', new Date(2021, 3, 25), {"end": new Date(2021, 3, 26, 23, 59, 59), "start": new Date(2021, 3, 26, 0, 0, 0)} ],
            ["Monday",    '5', new Date(2021, 3, 19), {"end": new Date(2021, 3, 23, 23, 59, 59), "start": new Date(2021, 3, 19, 0, 0, 0)} ],
            ["Friday",    '5', new Date(2021, 3, 23), {"end": new Date(2021, 3, 23, 23, 59, 59), "start": new Date(2021, 3, 19, 0, 0, 0)} ],
            ["Saturday",  '5', new Date(2021, 3, 24), {"end": new Date(2021, 3, 30, 23, 59, 59), "start": new Date(2021, 3, 26, 0, 0, 0)} ],
            ["Thursday",  '5', new Date(2021, 3, 25), {"end": new Date(2021, 3, 30, 23, 59, 59), "start": new Date(2021, 3, 26, 0, 0, 0)} ],
        ])('#%# getDateInterval %s', (formattet, days, date, expected) => {
            expect(getDateInterval(date, days)).toStrictEqual(expected);
        });
    })
}) 
