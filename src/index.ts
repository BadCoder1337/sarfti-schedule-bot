import * as dotenv from 'dotenv';
dotenv.config();

import { Util, UtilDate } from './utils';
import db, { Lesson, Op, Week } from './db';
import Fetcher from './fetcher';
import Parser from './parser';
import { Sequelize } from 'sequelize-typescript';
import VK from 'vk-io';
import bot from './bot';

class App {
    public db: Sequelize;
    public bot: VK;
    public updateTimeot: NodeJS.Timeout;

    public async init() {
        this.db = await db(process.env.DB, process.env.NODE_ENV === 'development');
        this.bot = bot;
        this.bot.updates.start();

        await this.refreshWeeks();

        this.refreshSchedule();

        return this;
    }

    public async refreshSchedule() {
        const fetcher = new Fetcher();
        const weeksToFetch = await Week.findAll({ where: {
            date: {
                [Op.gte]: new UtilDate()
                    .getWeek(),
                [Op.lte]: new UtilDate(Date.now() + 7 * 24 * 3600 * 1000)
                    .getWeek()
            }
        }});

        let newSchedule: Lesson[] = [];

        for (const week of weeksToFetch) {
            const raw = await fetcher.getSchedule(week.id);
            const parsed = new Parser(raw).getLessons();
            newSchedule = [...newSchedule, ...parsed];
        }

        const savedSchedule = await Lesson.findAll({ where: {
            date: {
                [Op.and]: [{
                    [Op.gte]: weeksToFetch[0].date,
                }, {
                    [Op.lt]: weeksToFetch[1].date
                }]
            }
        }});

        // Util.compareScheduleTables(newSchedule, savedSchedule);
        console.log(newSchedule.filter(s => s.group === 'ВТ-19'));
    }

    public async refreshWeeks() {
        const rawWeeks = await new Fetcher().getWeeks();
        const weeks = new Parser(rawWeeks).getWeeks();

        const dbWeeks = await Promise.all([...weeks.entries()]
            .map(w =>
                Week.findOrCreate({ where:
                    {
                        date: UtilDate.fromWeekString(w[0]).toString(),
                        id: w[1],
                    }
                })
            ));

        return dbWeeks.map(w => w[1] && w[0]).filter(Boolean);
    }
}

const app = new App().init();

export default app;