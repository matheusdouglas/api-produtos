import { User } from "../models/Users";
import { client } from "../database/db";
import { IUserRepository } from "../interfaces/IUserRepository";

export class UserRepository implements IUserRepository {
    
    async create(usuario: User): Promise<User | undefined> {
        const query = `INSERT INTO users (name, email, password) VALUES ($1, $2, $3);`
        const user = await client.query(query, [usuario.name, usuario.email, usuario.password]);
        return user.rows[0];
    }

    async findByEmail(email: string) : Promise<User | undefined> { 
        const query = `SELECT * FROM users WHERE email = $1`;
        const user = await client.query(query, [email]);
        return user.rows[0];
    }
}