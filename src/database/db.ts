import pg from 'pg';
const { Client } = pg;

export const client = new Client({
    user: 'admin',
    password: 'admin',
    host: 'localhost',
    port: 5432,
    database: 'api_produtos',
});
