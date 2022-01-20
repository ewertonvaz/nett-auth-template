import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, getConnection, getConnectionManager } from 'typeorm';

// const connection = getConnection('appdata');
// const connection = getConnectionManager().get("appdata");

@Entity()
export class Event extends BaseEntity {
    // private usedConnection = connection;

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
        const connection = getConnectionManager().get("appdata");
        Event.useConnection(connection);
    }
}