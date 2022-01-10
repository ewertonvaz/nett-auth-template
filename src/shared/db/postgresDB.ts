import { Pool } from 'pg';
import conf from '../../config/settings';

const params = {...conf.POSTGRES, database: 'authdb'};

export const postgresDB = new Pool( params );