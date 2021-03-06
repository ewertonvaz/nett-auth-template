import { mysqlDB } from '../shared/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import User from '../models/user.model';
import {v4 as uuidV4} from 'uuid';
import msad from './user.msad.repository';

const conf = process.env.NODE_ENV === 'development' ? require('../config/settings_dev').default : require('../config/settings_prod').default;

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

    async loginMsAd(username : string, passwd : string) : Promise<User|null> {

        const userMsAd = await msad.loginMsAd(username, passwd);
        if (!userMsAd) return null;

        const email = userMsAd.mail;

        var user = await UserRepository.findByEmail(email);

        if (!user) {
           const newUser = {
              name : userMsAd.displayName,
              username : userMsAd.sAMAccountName,
              password: passwd,
              email,
              is_admin : userMsAd.is_admin
            };
            user = await UserRepository.newUser(newUser);
        }

        if (user) user.is_admin = userMsAd.is_admin;
        return user;
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

    static async findByEmail(email: string) : Promise<User|null> {
        const query = `
        SELECT *
        FROM user
        WHERE email = ? ;`;
        const values = [ email ];
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

    async findMsAdByUUID( uuid : string ) : Promise<User|null>  {
        const query = `
        SELECT *
        FROM user
        WHERE uuid = ? ;`;
        const values = [ uuid ];
        if ( mysqlDB !== undefined ) {
            const [ rows ] = await mysqlDB.query<RowDataPacket[]>(query, values);
            const user = rows[0] as User;
            if (!user) return null;

            const adUser = user.username ? await msad.findUser(user.username) : null;
            if (adUser) user.is_admin = adUser.is_admin;
            return user;
        } else {
            return null;
        }
    }

    async createUser( user : User) : Promise<User|null>  {
        const { name, password, email, username, is_admin } = user;
        const user_id = uuidV4();
        const values = [ user_id, name, email, password, username, is_admin ];
        const insertQuery = `INSERT INTO user (uuid, name, email, password, username, is_admin) VALUES (?, ?, ?,  HEX(AES_ENCRYPT(?, '${key + email}', 512)), ?, ? );`;
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

    static async newUser( user : User) : Promise<User|null>  {
        const { name, password, email, username, is_admin } = user;
        const user_id = uuidV4();
        const values = [ user_id, name, email, password, username, is_admin ];
        const insertQuery = `INSERT INTO user (uuid, name, email, password, username, is_admin) VALUES (?, ?, ?,  HEX(AES_ENCRYPT(?, '${key + email}', 512)), ?, ? );`;
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
        const { uuid, name, email, username, is_admin } = user;
        var values = [name, email, username, is_admin, uuid ];
        const passwdQuery = `
          SELECT uuid, name, email, username, is_admin, CAST(AES_DECRYPT(UNHEX(password), CONCAT('${key}', email)) as CHAR) as password 
          FROM user 
          WHERE  uuid = '${uuid}';`;
        const updateQuery = `
            UPDATE user
            SET password = HEX(AES_ENCRYPT(?, '${key + email}', 512)), name = ?, email = ?, username = ?, is_admin = ? 
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

    async updatePassword(user : User, actual: String, newpasswd: String) : Promise<User|null>  {
        const passwdQuery = `
        SELECT uuid, name, email, username, is_admin, CAST(AES_DECRYPT(UNHEX(password), CONCAT('${key}', email)) as CHAR) as password 
        FROM user 
        WHERE  uuid = '${user.uuid}';`;
        const [ actualUser ] = await mysqlDB.query<RowDataPacket[]>(passwdQuery);
        if ( actual === actualUser[0].password) {
          const updateQuery = `
            UPDATE user
            SET password = HEX(AES_ENCRYPT(?, '${key + user.email}', 512)) 
            WHERE uuid = ?
          ;`;
          const values = [newpasswd, user.uuid ];
          try {
            const result  = await mysqlDB.query(updateQuery, values);
            const { affectedRows } = result[0] as ResultSetHeader;
            if (affectedRows === 1) {
                const [ updatedUser ] = await mysqlDB.query<RowDataPacket[]>(passwdQuery);
                return updatedUser[0] as User;
            } else { return null }
          } catch(err) {
            return null;
          }
        } else {
          return null;
        }
    }

    async listUsers() {
        const query = `SELECT uuid, name, email, username, user_token, email_validated, is_admin
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