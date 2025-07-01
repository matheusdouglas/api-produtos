import { User } from "../models/Users";

export interface IUserService {
    create(user: User): Promise<User | undefined>
    findByEmail(email: string): Promise<User | undefined>
}
