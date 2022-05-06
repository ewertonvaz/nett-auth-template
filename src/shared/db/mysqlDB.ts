import mysql from 'mysql2/promise';
//import conf from '../../config/settings';
const conf = process.env.NODE_ENV === 'development' ? require('../../config/settings_dev').default : require('../../config/settings_prod').default;

const params = {...conf.MYSQL, database: 'authdb'};

export const mysqlDB = mysql.createPool( params );