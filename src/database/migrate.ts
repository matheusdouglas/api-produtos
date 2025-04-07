import { client } from '../database/db';

const query = `
  CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL
  );
`;

async function createTable() {
    try {
        await client.connect();
        await client.query(query);
        console.log("Tabela criada com sucesso.");
    } catch (error: any) {
        console.error("Erro ao criar tabela:", error.message);
    } finally {
        await client.end();
    }
}

createTable();
