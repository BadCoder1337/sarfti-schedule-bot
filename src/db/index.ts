import Lesson from './Lesson';
import Person from './Person';
import { Sequelize } from 'sequelize-typescript';
import Week from './Week';

export default async (url: string, logging = false) => {
    const DB = new Sequelize(url, { logging });
    await DB.authenticate();
    DB.addModels([Person, Lesson, Week]);
    await DB.sync({ force: process.env.DROP_DB === 'true' });

    return DB;
};

export { Lesson, Person, Week };
export { Op } from 'sequelize';