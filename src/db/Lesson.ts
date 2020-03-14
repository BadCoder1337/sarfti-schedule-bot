import { Column, DataType, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { LESSON_TYPE } from '../types';

@Table({
    timestamps: true
})
export default class Lesson extends Model<Lesson> {

    @IsUUID(4)
    @PrimaryKey
    @Column
    id: number;

    @Column
    group: string;

    @Column
    name: string;

    @Column
    position: number;

    @Column
    room: string;

    @Column
    teacher: string;

    @Column(DataType.STRING)
    type: LESSON_TYPE;

    @Column
    date: Date;
}