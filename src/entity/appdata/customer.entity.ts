import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';

@Entity()
export class Customer {
    @PrimaryColumn({type: "varchar", length: 128,  default: () => "(uuid())"})
    uuid: string | undefined;

    @Column({type: "varchar", length: 255})
    name: string | undefined;

    @Column({type: "varchar", length: 255, unique: true})
    email: string | undefined;

    @Column({type: "varchar", length: 255})
    password?: string;

    @Column({type: "varchar", length: 255, nullable: true})
    user_token?: string;

    @Column({default: false})
    email_validated: boolean;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
    created_at: Date | undefined;

    @Column({type: "timestamp", default: () => "CURRENT_TIMESTAMP", onUpdate: "CURRENT_TIMESTAMP"})
    updated_at: Date | undefined;

    constructor () {
      this.email_validated = false;
    }
}