import * as dotenv from 'dotenv';
dotenv.config();

import Parser from './parser';
import { Sequelize } from 'sequelize-typescript';
import VK from 'vk-io';
import bot from './bot';
import db from './db';

// async function main() {
// 	await db(process.env.DB);
// 	await start();
// }

// main();

// const pars = new Parser();
// console.log(pars);

class App {
    public db: Sequelize;
    public bot: VK;
    public updateTimeot: NodeJS.Timeout;
    
    public async init() {
        this.db = await db(process.env.DB);
        this.bot = bot;
        this.bot.updates.start();

        this.scheduledUpdate();

        return this;
    }

    public async scheduledUpdate() {

        

        const time = 5000;

        this.updateTimeot = setTimeout(this.scheduledUpdate.bind(this), time);

    }
}

const app = new App().init();

export default app;