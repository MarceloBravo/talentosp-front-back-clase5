// backend/db/connection.js
const { Pool } = require('pg');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: false, // Important for local development without SSL
};

const pool = new Pool(dbConfig);

module.exports = pool;