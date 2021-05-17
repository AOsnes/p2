import getWeekday from './getWeekday';
import getWeek from './getWeek';
import toHHMM from './toHHMM';
import currentDay from './currentDay';
import addDays from './addDays';
import calculatePosition from './calculatePosition';
import calculateHeight from './calculateHeight';

describe('Utility tests', () =>{
    jest.restoreAllMocks()
    describe('getWeekday tests', () =>{
        test.each([
            [0, "Søndag"],
            [1, "Mandag"],
            [2, "Tirsdag"],
            [3, "Onsdag"],
            [4, "Torsdag"],
            [5, "Fredag"],
            [6, "Lørdag"],
            [123, null],
        ])('#%# getWeekday(%p) returns %p', (weekday, expected) => {
            expect(getWeekday(weekday)).toBe(expected);
        });
    })
    describe('getWeek tests', () =>{
        test.each([
            [new Date("2021-01-04T12:00:00"), 1],
            [new Date("2021-01-03T12:00:00"), 53],
            [new Date("2022-01-11T12:00:00"), 2],
        ])('#%# getWeek %p returns %p', (date, expected) =>{
            expect(getWeek(date)).toBe(expected);
        })
    })

    describe('toHHMM tests', () =>{
        test.each([
            [new Date("2021-05-11T09:09:00"), "09:09"],
            [new Date("2021-05-11T10:10:00"), "10:10"],
            [new Date("2021-05-11T12:34:00"), "12:34"],
            [new Date("2021-05-11T00:59:00"), "00:59"],
            [new Date("2021-05-11T12:00:00"), "12:00"],
            [new Date("2021-05-11T12:34:59"), "12:34"],
            [new Date("This date wont work"), "NaN:NaN"],
        ])('#%# toHHMM %p returns %p', (date, expected) =>{
            expect(toHHMM(date)).toBe(expected);
        });
    })
    describe('currentDay tests', () =>{
        test.each([
            [new Date("2021-05-09T09:09:00"), "Søndag"],
            [new Date("2021-05-10T09:09:00"), "Mandag"],
            [new Date("2021-05-11T09:09:00"), "Tirsdag"],
            [new Date("2021-05-12T09:09:00"), "Onsdag"],
            [new Date("2021-05-13T09:09:00"), "Torsdag"],
            [new Date("2021-05-14T09:09:00"), "Fredag"],
            [new Date("2021-05-15T09:09:00"), "Lørdag"],
        ])('#%# currentDay %p returns %p', (date, expected) =>{
            const spy = jest.spyOn(global, 'Date').mockImplementation(() => date)
            expect(currentDay()).toBe(expected);
            spy.mockRestore();
        })
    })
    describe('addDays tests', () =>{
        test.each([
            [0, new Date("2021-01-01T12:00:00"), new Date("2021-01-01T12:00:00")],
            [-1, new Date("2021-01-01T12:00:00"), new Date("2020-12-31T12:00:00")],
            [1, new Date("2021-01-01T12:00:00"), new Date("2021-01-02T12:00:00")],
            [31, new Date("2021-01-01T12:00:00"), new Date("2021-02-01T12:00:00")],
            [365, new Date("2021-01-01T12:00:00"), new Date("2022-01-01T12:00:00")],
            [366, new Date("2024-01-01T12:00:00"), new Date("2025-01-01T12:00:00")],
        ])('changing by %p day(s) from date [%p] gives [%p]', (days, date, expected) =>{
            const spy = jest.spyOn(global, 'Date').mockImplementation(() => date)
            expect(addDays(date, days)).toStrictEqual(expected)
            spy.mockRestore();
        })
    })
    describe('calculatePosition tests', () =>{
        test.each([
            [new Date("2021-01-01T04:00:00"), 0, "-50%"],
            [new Date("2021-01-01T08:00:00"), 0, "0%"],
            [new Date("2021-01-01T09:00:00"), 0, "12.5%"],
            [new Date("2021-01-01T09:30:00"), 0, "18.75%"],
            [new Date("2021-01-01T16:00:00"), 0, "100%"],
            [new Date("2021-01-01T10:00:00"), 2, "0%"],
        ])('calculatePosition [%p] with %p offset returns %p', (date, offset, expected) =>{
            expect(calculatePosition(date, offset)).toBe(expected);
        })
    })

    /* This one will fail if the scale is changed, maybe want to have it as parameter then */
    describe('calculateHeight tests', () =>{
        test.each([
            [new Date("2021-01-01T08:00:00"), new Date("2021-01-01T09:00:00"), "81.25px"],
            [new Date("2021-01-01T08:00:00"), new Date("2021-01-01T09:30:00"), "121.875px"],
            [new Date("2021-01-01T08:00:00"), new Date("2021-01-01T07:00:00"), "-81.25px"],
        ])('calculateHeight with start [%p] and end [%p] returns %p', (startDate, endDate, expected) =>{
            expect(calculateHeight(startDate, endDate)).toBe(expected);
        })
    })
})
