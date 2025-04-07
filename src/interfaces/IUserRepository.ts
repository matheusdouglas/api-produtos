import { User } from "../models/Users";

export interface IUserRepository {
    create(user: User): Promise<User | undefined>
    findByEmail(email: string): Promise<User | undefined>
}