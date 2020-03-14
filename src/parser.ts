import { DAY_OF_WEEK } from './types';
import { IncorrectHTMLError } from './errors';
import { JSDOM } from 'jsdom';
import { Lesson } from './db';

export default class Parser {
    constructor(private rawData: string) {
        const pData = new JSDOM(rawData);

        if (pData.window && pData.window.document) {
            this.parsedData = pData.window.document;
        } else {
            throw new IncorrectHTMLError(`${rawData.slice(0, 10)}... isn't a valid HTML`);
        }
    }

    public parsedData: Document;

    public getGroups() {
        return [...this.parsedData.querySelectorAll('table.edit > tbody > tr > th')].slice(2).map(th => th.textContent);
    }

    public getLessons() {
        const groups = this.getGroups();
        const rows = [...this.parsedData.querySelectorAll('table.edit > tbody > tr')].slice(1);
        const week = this.getWeek();

        return rows.map(r =>
            [...r.childNodes]
                .slice(2)
                .map((cell, i) =>
                    cell.childNodes.length
                    && new Lesson({
                        date: new Date().setDate(week.getDate() + parseInt(DAY_OF_WEEK[r.childNodes[0].textContent])),

                        group: groups[i],

                        name: cell.childNodes[0].textContent,
                        positon: r.childNodes[1].textContent,
                        room: cell.childNodes[6].textContent,
                        teacher: cell.childNodes[2].textContent,
                        type: cell.childNodes[4].textContent,
                    })
                )
        )
        .flat();
    }

    public getWeek() {
        return new Date(
            this.parsedData
                .querySelector('option[selected]')
                .textContent
        );
    }
}