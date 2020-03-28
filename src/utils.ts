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

    static fromWeekString(week: string) {
        const date = new Date(week);

        return new UtilDate(date.valueOf() + date.getTimezoneOffset() * 60 * 1000);
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

export class DiffUtil {
    static compareScheduleTables(newTable: Lesson[], oldTable: Lesson[]) {
        console.log(newTable, oldTable);

        const NTDaysSet = new Set(newTable.map(nt => nt.date.valueOf()));
        const OTDaysSet = new Set(oldTable.map(ot => ot.date.valueOf()));

        const NTMap = new Map([...NTDaysSet.values()].map(date => [date, newTable.filter(nt => nt.date.valueOf() === date)]));
        const OTMap = new Map([...OTDaysSet.values()].map(date => [date, oldTable.filter(ot => ot.date.valueOf() === date)]));

        const newLessons = new Map([...NTMap.entries()].filter(ent => OTMap.get(ent[0]).));
        const cancelledLessons = [];
    }

    static compareDays(newDay: Lesson[], oldDay: Lesson[]) {

    }

    static isSameLessons(one: Lesson, two: Lesson) {
        return one && two
            && one.date.valueOf() === two.date.valueOf()
            && one.group === two.group
            && one.name === two.name
            && one.type === two.type
    }
}