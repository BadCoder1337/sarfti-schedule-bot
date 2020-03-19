import { Lesson } from './db';

export class UtilDate extends Date {
    static ZERO_WEEK = new Date('2017-04-24');

    static toMonday (date: Date) {
        return new Date(
            date.valueOf()
            - 24 * 3600 * 1000 * (
                date.getDay() !== 0
                    ? date.getDay() - 1
                    : 6
            )
        );
    }

    public getWeekString() {
        const date = UtilDate.toMonday(this);

        return `${date.getFullYear()}-${date.getMonth().toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
    }

    public getWeek() {
        const date = UtilDate.toMonday(this);
        date.setHours(0, 0, 0, 0);

        return date;
    }
}

export class Util {
    static compareScheduleTables(newTable: Lesson[], oldTable: Lesson[]) {
        console.log(newTable, oldTable);
    }
}