import * as FormData from 'form-data';
import fetch, { Response } from 'node-fetch';

export default class Fetcher {
    static parseCookies(response: Response) {
        const raw = response.headers.raw()['set-cookie'];

        return raw.map(entry => entry.split(';')[0]).join(';');
    }

    public get(url: string) {
        return fetch(url, { method: 'GET' });
    }

    public post(url: string, body?: [string, unknown][]) {
        const form = new FormData();

        body.forEach(b => form.append(...b));

        return fetch(
            url,
            {
                body: form,
                headers: {
                    cookie: this.cookies
                },
                method: 'POST',
            }
        );
    }

    constructor(public weekId?: number, public cookies?: string) {}

    // private retries: number;

    private async initSession() {
        if (this.cookies) { return; }

        const resGet = await this.get('http://scs.sarfti.ru');
        this.cookies = Fetcher.parseCookies(resGet);

        const resPost = await this.post('http://scs.sarfti.ru/login/index', [
            ['login', ''],
            ['password', ''],
            ['guest', 'Войти как Гость']
        ]);

        const text = await resPost.text();

    }

    private async fetchWeeks() {
        const res = await this.post('http://scs.sarfti.ru/date/printT', [
            ['id', 1],
            ['show', 'Распечатать']
        ]);
        const text = await res.text();

        return text;
    }

    private async fetchSchedule(week: number) {
        const res = await this.post('http://scs.sarfti.ru/date/printT', [
            ['id', week],
            ['show', 'Распечатать']
        ]);

        return res.text();
    }

    public async getSchedule(week?: number): Promise<string> {
        if (this.cookies) {
            return this.fetchSchedule(week || this.weekId);
        } else {
            await this.initSession();

            return this.getSchedule();
        }
    }

    public async getWeeks(): Promise<string> {
        if (this.cookies) {
            return this.fetchWeeks();
        } else {
            await this.initSession();

            return this.getWeeks();
        }
    }

}