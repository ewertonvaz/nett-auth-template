import { postgresDB } from '../shared/db';
import User from '../models/user.model';
import conf from '../config/settings';

const key = conf.SECRET_KEY;

class UserRepository {
    async loginUser(email : string, password : string) : Promise<User|null> {
        try {
            const query = `
                SELECT *
                FROM "user"
                WHERE email = $1 AND $2 = PGP_SYM_DECRYPT(password::bytea, $3);
            `;
            const values = [ email, password, key + email ]; //Para evitar SQL Injection usar a query com parâmetros em vez de colocar o valor uuid direto na string template
            const { rows } = await postgresDB.query<User>(query, values);
            const [ user ] = rows;
            return !user ? null : user ;
        } catch(error) {
            //throw new DatabaseError('Ocorreu um erro durante a consulta ao banco de dados!', error);
            return null;
        }
    }

    async findByEmailAndPassword( email : string, password : string) : Promise<User|null>  {
        try {  
            const query = `
            SELECT *
            FROM "user"
            WHERE email = $1 AND $2 = PGP_SYM_DECRYPT(password::bytea, $3);
            `;
            const values = [ email, password, key + email ]; 
            const { rows } = await postgresDB.query<User>(query, values);
            const [ user ] = rows;
            return !user ? null : user ;
        } catch (error) {
            //throw new DatabaseError('Ocorreu um erro durante a consulta ao banco de dados!', error);
            return null;
        }
    }

    async findByUUID( uuid : string ) : Promise<User|null>  {
        try {
            const query = `
                SELECT *
                FROM "user"
                WHERE uuid = $1
            `;
            const values = [ uuid ];
            const { rows } = await postgresDB.query<User>(query, values);
            const [ user ] = rows;
            return user;
        } catch(error) {
            // throw new DatabaseError('Ocorreu um erro durante a consulta ao banco de dados!', error);
            return null;
        }
    }

    async createUser( user : User) : Promise<User|null>  {
        try {
            const { name, password, email, is_admin } = user;
            const values = [ name, email, password, key + email, is_admin ];
            const query = `
                INSERT INTO "user" (name, email, password, is_admin)
                VALUES ($1, $2, PGP_SYM_ENCRYPT($3, $4), $5)
                RETURNING uuid
            `;
            const { rows } = await postgresDB.query<{ uuid : string}>(query, values);
            const [ newUser ] = rows;
            return this.findByUUID( newUser.uuid ) ;
        } catch {
            return null;
        }
    }

    async updateUser(user : User) : Promise<User|null>  {
        const { uuid, name, email, is_admin } = user;
        if (!uuid) {
            return null;
        }
        const originalUserData = await this.findByUUID(uuid);
        if (!originalUserData) {
            return null;
        }
        var values = [name, email, is_admin, uuid ];
        const passwdQuery = `
          SELECT PGP_SYM_DECRYPT(password::bytea, '${ key + originalUserData.email}') as senha 
          FROM "user" 
          WHERE  uuid = '${uuid}';`;
        const updateQuery = `
            UPDATE "user"
            SET password = PGP_SYM_ENCRYPT($1, '${key + email}'), name = $2, email = $3, is_admin = $4 
            WHERE uuid = $5
            RETURNING uuid, name, email, is_admin
        ;`;
        try {
            var { rows } = await postgresDB.query<{ senha : string}>(passwdQuery);
            var [ senha ] = rows;
            values.unshift(senha.senha);
            const result = await postgresDB.query<User>(updateQuery, values);
            const linhas = result.rows;
            const [ user ] = linhas;
            if (user) {
                //return user[0] as User;
                return user;
            } else { return null }
        } catch(err) {
            return null;
        }
    }

    async updatePassword(user : User, actual: String, newpasswd: String) : Promise<User|null>  {
        const passwdQuery = `
        SELECT PGP_SYM_DECRYPT(password::bytea, '${key + user.email}') as senha 
        FROM "user" 
        WHERE  uuid = '${user.uuid}';`;

        const { rows } = await postgresDB.query<{ senha : string}>(passwdQuery);
        const [ senha ] = rows;

        if ( actual === senha.senha ) {
          const updateQuery = `
            UPDATE "user"
            SET password = PGP_SYM_ENCRYPT($1, '${key + user.email}') 
            WHERE uuid = $2
            RETURNING uuid, name, email, is_admin, PGP_SYM_DECRYPT(password::bytea, '${key + user.email}') as password 
          ;`;
          const values = [newpasswd, user.uuid ];
          try {
            const result = await postgresDB.query<User>(updateQuery, values);
            const linhas = result.rows;
            const [ updatedUser ] = linhas;
            if (updatedUser) {
                return updatedUser;
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
        FROM "user";`;
        try {
          const { rows } = await postgresDB.query<User>(query);
          return rows || [];
        } catch(err) {
          // throw new DatabaseError('Ocorreu um erro durante a consulta ao banco de dados!', error);
          return null;
        }
    }

    async deleteUser( user : User) : Promise<Number|null>  {
        const { uuid } = user;
        const values = [ uuid ];
        const deleteQuery = `DELETE FROM "user" WHERE uuid = $1 RETURNING *;`;
        if ( postgresDB !== undefined ) {
            try {
                const { rows }  = await postgresDB.query(deleteQuery, values);
                return rows.length;
            } catch(err) {
                return null;
            }
        } else {
            return null;
        }
    }
}

export default new UserRepository;