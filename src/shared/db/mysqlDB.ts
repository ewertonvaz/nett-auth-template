import mysql from 'mysql2/promise';
import conf from '../../config/settings';

const params = {...conf.MYSQL, database: 'authdb'};

export const mysqlDB = mysql.createPool( params );