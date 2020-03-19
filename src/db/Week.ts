import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table
export default class Week extends Model<Week> {

    @PrimaryKey
    @Column
    id: number;

    @Column
    date: Date;

}