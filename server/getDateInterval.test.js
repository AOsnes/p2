import { getDateInterval} from './util';

test('getDateIntervalMonday1', () =>{
    let start = new Date(2021, 3, 19, 0, 0, 0);
    let end = new Date(2021, 3, 19, 23, 59, 59);
    let expectedObject = {start, end};
    expect(getDateInterval(new Date (2021, 3, 19), '1')).toEqual(expectedObject);
})

