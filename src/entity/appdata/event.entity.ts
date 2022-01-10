import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, getConnection } from 'typeorm';

@Entity()
export class Event extends BaseEntity {
    @PrimaryGeneratedColumn('increment')
    id: number | undefined;

    @Column({type: "varchar", length: 128})
    title: string | undefined;

    @Column({type: "varchar", length: 5})
    time: string | undefined;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    date: Date | undefined;

    constructor() {
        super();
        const connection = getConnection('appdata');
        Event.useConnection(connection);
    }
}