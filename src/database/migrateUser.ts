import { client } from "./db"


const query = `CREATE TABLE IF NOT EXISTS users (
               id SERIAL PRIMARY KEY,
               name VARCHAR(255) NOT NULL,
               email VARCHAR(255) NOT NULL,
               password VARCHAR(255) NOT NULL

);`

async function createTableUsers() {
    try {
        await client.connect()
        await client.query(query)
        console.log("Tabela criada com sucesso.");
    } catch (error : any) {
        console.error("erro ao criar tabel de usuario", error.message)
    }finally {
        await client.end()
    }
}

createTableUsers()