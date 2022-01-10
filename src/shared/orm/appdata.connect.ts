import conf from '../../config/settings';
export const appdata = { 
    name : "appdata",
    type: "mysql",
    host: conf.MYSQL.host,
    port: conf.MYSQL.port,
    password: conf.MYSQL.password,
    username: conf.MYSQL.user,
    database: "appdata",
    synchronize: true,
    logging: false,
    entities: [
      "src/entity/appdata/*.{js,ts}"
    ],
    migrations: [
      "src/migration/appdata/*.{js,ts}"
    ],
    subscribers: [
      "src/subscriber/appdata/*.{js,ts}"
    ]
}