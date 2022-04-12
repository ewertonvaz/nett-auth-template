export default {
  SECRET_KEY: "Use yarn generate para gerar esta chave",
  ADM_TOKEN_EXPIRES: "30m",
  USER_TOKEN_EXPIRES: "2 days",
  MYSQL: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'secret',
    database: 'authdb'
  },
  POSTGRES: {
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'secret',
    database: 'authdb'
  },
  MS_AD: {
    url: 'ldap://dc.domain.com',
    user: 'username@domain.com',
    pass: 'password'
  }
}