import { mysqlDB } from '../shared/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import User from '../models/user.model';
import {v4 as uuidV4} from 'uuid';
import conf from '../config/settings';

const key = conf.SECRET_KEY;

class UserRepository {
    async loginUser(email : string, passwd : string) : Promise<User|null> {
        const query = `
        SELECT *
        FROM user
        WHERE email = ? AND AES_DECRYPT(UNHEX(password), '${key + email}') = ?;`;
        const values = [ email, passwd ];
        if ( mysqlDB !== undefined ) {
            const [ rows ] = await mysqlDB.query<RowDataPacket[]>(query, values);
            return rows[0] as User;
        } else {
           return null;
        }
    }

    async findByEmailAndPassword( email : string, password : string) : Promise<User|null>  {
        const query = `
        SELECT *
        FROM user
        WHERE email = ? AND AES_DECRYPT(UNHEX(password), '${key + email}') = '${password}';`;
        const values = [ email, password ];
        if ( mysqlDB !== undefined ) {
            const [ rows ] = await mysqlDB.query<RowDataPacket[]>(query, values);
            return rows[0] as User;
        } else {
            return null;
        }
    }

    async findByUUID( uuid : string ) : Promise<User|null>  {
        const query = `
        SELECT *
        FROM user
        WHERE uuid = ? ;`;
        const values = [ uuid ];
        if ( mysqlDB !== undefined ) {
            const [ rows ] = await mysqlDB.query<RowDataPacket[]>(query, values);
            return rows[0] as User;
        } else {
            return null;
        }
    }

    async createUser( user : User) : Promise<User|null>  {
        const { name, password, email, is_admin } = user;
        const user_id = uuidV4();
        const values = [ user_id, name, email, password, is_admin ];
        const insertQuery = `INSERT INTO user (uuid, name, email, password, is_admin) VALUES (?, ?, ?,  HEX(AES_ENCRYPT(?, '${key + email}', 512)), ? );`;
        const selectQuery = `SELECT * FROM user WHERE uuid='${user_id}';`;
        if ( mysqlDB !== undefined ) {
            try {
                const result  = await mysqlDB.query(insertQuery, values);
                const { affectedRows } = result[0] as ResultSetHeader;
                if (affectedRows === 1) {
                    const [ user ] = await mysqlDB.query<RowDataPacket[]>(selectQuery, values);
                    return user[0] as User;
                } else { return null }
            } catch(err) {
                return null;
            }
        } else {
            return null;
        }
    }

    async updateUser(user : User) : Promise<User|null>  {
        const { uuid, name, email, is_admin } = user;
        var values = [name, email, is_admin, uuid ];
        const passwdQuery = `
          SELECT uuid, name, email, is_admin, CAST(AES_DECRYPT(UNHEX(password), CONCAT('${key}', email)) as CHAR) as password 
          FROM user 
          WHERE  uuid = '${uuid}';`;
        const updateQuery = `
            UPDATE user
            SET password = HEX(AES_ENCRYPT(?, '${key + email}', 512)), name = ?, email = ?, is_admin = ? 
            WHERE uuid = ?
        ;`;
        if ( mysqlDB !== undefined ) {
            try {
                const [ password ] = await mysqlDB.query<RowDataPacket[]>(passwdQuery);
                const originalUser = password[0] as User;
                values.unshift(originalUser.password);
                const result  = await mysqlDB.query(updateQuery, values);
                const { affectedRows } = result[0] as ResultSetHeader;
                if (affectedRows === 1) {
                    //return user[0] as User;
                    return user;
                } else { return null }
            } catch(err) {
                return null;
            }
        } else {
            return null;
        }
    }

    async listUsers() {
        const query = `SELECT uuid, name, email, user_token, email_validated, is_admin
        FROM user;`;
        if ( mysqlDB !== undefined ) {
            const [ rows ] = await mysqlDB.query<RowDataPacket[]>(query);
            return rows;
        } else {
            return null;
        }
    }

    async deleteUser( user : User) : Promise<Number|null>  {
        const { uuid } = user;
        const values = [ uuid ];
        const deleteQuery = `DELETE FROM user WHERE uuid = ?;`;
        if ( mysqlDB !== undefined ) {
            try {
                const [ result ]  = await mysqlDB.query<ResultSetHeader>(deleteQuery, values);
                return result.affectedRows;
            } catch(err) {
                return null;
            }
        } else {
            return null;
        }
    }
}

export default new UserRepository;