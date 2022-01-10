"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../shared/db");
const settings_1 = require("../config/settings");
const uuid_1 = require("uuid");
class UserRepository {
    async loginUser(name, passwd) {
        const query = `
        SELECT *
        FROM user
        WHERE name = ? AND AES_DECRYPT(UNHEX(password), '${settings_1.secret_key}') = ?;`;
        const values = [name, passwd];
        if (db_1.mysqlDB !== undefined) {
            const [rows] = await db_1.mysqlDB.query(query, values);
            return rows[0];
        }
        else {
            return null;
        }
    }
    async findByNameAndPassword(name, password) {
        const query = `
        SELECT *
        FROM user
        WHERE name = ? AND AES_DECRYPT(UNHEX(password), '${settings_1.secret_key}') = '${password}';`;
        const values = [name, password];
        if (db_1.mysqlDB !== undefined) {
            const [rows] = await db_1.mysqlDB.query(query, values);
            return rows[0];
        }
        else {
            return null;
        }
    }
    async createUser(user) {
        const { name, password, email } = user;
        const user_id = (0, uuid_1.v4)();
        const values = [user_id, name, email, password];
        const insertQuery = `INSERT INTO user (uuid, name, email, password) VALUES (?, ?, ?,  HEX(AES_ENCRYPT(?, '${settings_1.secret_key}', 512)) );`;
        const selectQuery = `SELECT * FROM user WHERE uuid='${user_id}';`;
        if (db_1.mysqlDB !== undefined) {
            try {
                const result = await db_1.mysqlDB.query(insertQuery, values);
                const { affectedRows } = result[0];
                if (affectedRows === 1) {
                    const [user] = await db_1.mysqlDB.query(selectQuery, values);
                    return user[0];
                }
                else {
                    return null;
                }
            }
            catch (err) {
                console.log(err);
                return null;
            }
        }
        else {
            return null;
        }
    }
}
exports.default = new UserRepository;
