import { Pool } from 'pg';
const conf = process.env.NODE_ENV === 'development' ? require('../../config/settings_dev').default : require('../../config/settings_prod').default;

const params = {...conf.POSTGRES, database: 'authdb'};

export const postgresDB = new Pool( params );