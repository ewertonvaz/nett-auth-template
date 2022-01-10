import conf from '../../config/settings';
export const auth = { 
    name : "auth",
    type: "mysql",
    host: conf.MYSQL.host,
    port: conf.MYSQL.port,
    password: conf.MYSQL.password,
    username: conf.MYSQL.user,
    database: "authdb",
    synchronize: true,
    logging: false,
    entities: [
      "src/entity/auth/*.{js,ts}"
    ],
    migrations: [
      "src/migration/auth/*.{js,ts}"
    ],
    subscribers: [
      "src/subscriber/auth/*.{js,ts}"
    ]
}