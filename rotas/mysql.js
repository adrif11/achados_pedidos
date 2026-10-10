const mysql = require('mysql');

// Valores padrão para o banco local da atividade.
const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'achados_perdidos',
    charset: 'utf8mb4',
    dateStrings: true
});

module.exports = pool;
