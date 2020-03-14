import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
    timestamps: true
})
export default class Person extends Model<Person> {

    @PrimaryKey
    @Column
    id: number;

    @Column
    group: string;

    @Column
    isConference: boolean;

    @Column
    overallNotification: Date;

    @Column
    regularNotification: Date;

}