import * as FormData from 'form-data';
import fetch, { Response } from 'node-fetch';

export default class Fetcher {
    static parseCookies(response: Response) {
        const raw = response.headers.raw()['set-cookie'];

        return raw.map(entry => entry.split(';')[0]).join(';');
    }

    private cookies: string;
    private weekId: number;

    private async initSession() {
        const form = new FormData();

        form.append('login', '');
        form.append('password', '');
        form.append('guest', 'Войти как Гость');

        const res = await fetch(
            'http://scs.sarfti.ru/login/index',
            {
                body: form,
                method: 'POST',
            }
        );

        this.cookies = Fetcher.parseCookies(res);
    }

    private async fetchSchedule() {

    }

    public async getSchedule(week: number) {
        if (this.cookies) {

        } else {

        }

    }
}