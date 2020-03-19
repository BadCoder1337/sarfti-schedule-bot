import { DAY_OF_WEEK } from './types';
import { IncorrectHTMLError } from './errors';
import { JSDOM } from 'jsdom';
import { Lesson } from './db';
import { UtilDate } from './utils';

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
        return this.isEmpty()
            ? null
            : [...this.parsedData.querySelectorAll('table.edit > tbody > tr > th')].slice(2).map(th => th.textContent);
    }

    public getLessons() {
        if (this.isEmpty()) { return null; }

        const groups = this.getGroups();
        const rows = [...this.parsedData.querySelectorAll('table.edit > tbody > tr')].slice(1);
        const week = this.getCurrentWeek();

        return rows.map(r =>
            [...r.childNodes]
                .slice(2)
                .map((cell, i) =>
                    cell.childNodes.length
                    && new Lesson({
                        date: new Date(week.valueOf() + 24 * 3600 * 1000 * parseInt(DAY_OF_WEEK[r.childNodes[0].textContent])),

                        group: groups[i],

                        name: cell.childNodes[0].textContent,
                        positon: r.childNodes[1].textContent,
                        room: cell.childNodes[6].textContent,
                        teacher: cell.childNodes[2].textContent,
                        type: cell.childNodes[4].textContent,
                    })
                )
        )
        .flat()
        .filter(Boolean);
    }

    public getWeeks() {
        return this.isAuth()
        ? null
        : new Map(
            [...this.parsedData.querySelectorAll('option')]
                .map(o => [o.textContent, parseInt(o.value)])
        );
    }

    public getCurrentWeek() {
        const query = this.parsedData.querySelector('option[selected]');

        return this.isAuth()
        ? null
        : UtilDate.fromWeekString(
            query && query.textContent
        );
    }

    public isEmpty() {
        const query = this.parsedData.querySelector('p.errorMessage');

        return this.isAuth()
            || (query && query.textContent === 'Данные на странице устарели. Откройте страницу заново.');
    }

    public isAuth() {
        return this.parsedData.querySelector('title').textContent === 'Авторизация SCS';
    }
}