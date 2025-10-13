import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // WARN: Use process.env for credentials in production!
    database: 'citrix',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});