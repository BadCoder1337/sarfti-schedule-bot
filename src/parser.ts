import { DAY_OF_WEEK } from './types';
import { IncorrectHTMLError } from './errors';
import { JSDOM } from 'jsdom';
import { Lesson } from './db';

export default class Parser {
    constructor(private rawData: string) {
        const pData = new JSDOM(rawData);

        if (pData instanceof HTMLElement) {
            this.parsedData = pData;
        } else {
            throw new IncorrectHTMLError(`${rawData.slice(0, 10)}... isn't a valid HTML`);
        }
    }

    public parsedData: JSDOM;

    public getGroups() {
        return this.parsedData.querySelectorAll('table.edit > tbody > tr > th').slice(2).map(th => th.text);
    }

    public getLessons() {
        const groups = this.getGroups();
        const rows = this.parsedData.querySelectorAll('table.edit > tbody > tr').slice(1);
        const week = this.getWeek();

        return rows.map(r =>
            r.childNodes
                .slice(2)
                .map((cell, i) =>
                    cell.childNodes.length
                    && new Lesson({
                        date: {...week}.setDate(week.getDate() + DAY_OF_WEEK[r.childNodes[0].text]),

                        group: groups[i],

                        name: cell.childNodes[0].text,
                        positon: r.childNodes[1].text,
                        room: cell.childNodes[6].text,
                        teacher: cell.childNodes[2].text,
                        type: cell.childNodes[4].text,
                    })
                )
        )
        .flat();
    }

    public getWeek() {
        return new Date(
            this.parsedData
                .querySelector('option[selected]')
                .text
        );
    }
}