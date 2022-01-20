import conf from '../../config/settings';
import path from 'path';

const workdir = (process.env.NODE_ENV === 'development' ? process.env.PWD + '/src' : process.env.PWD) as string;
console.log(workdir);

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
      //"src/entity/appdata/*.{js,ts}"
      path.resolve(workdir, 'entity/appdata/*.{js,ts}'),
    ],
    migrations: [
      //"src/migration/appdata/*.{js,ts}"
      path.resolve(workdir, 'migration/appdata/*.{js,ts}'),
    ],
    subscribers: [
      //"src/subscriber/appdata/*.{js,ts}"
      path.resolve(workdir, 'subscriber/appdata/*.{js,ts}'),
    ]
}