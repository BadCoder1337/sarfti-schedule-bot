import Lesson from './Lesson';
import Person from './Person';
import { Sequelize } from 'sequelize-typescript';

export default async (url: string, logging = false) => {
    const DB = new Sequelize(url, { logging });
    await DB.authenticate();
    DB.addModels([Person, Lesson]);
    await DB.sync();

    return DB;
};

export { Lesson, Person };