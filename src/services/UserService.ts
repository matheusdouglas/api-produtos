import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserService } from "../interfaces/IUserService";
import { User } from "../models/Users";

export class UserService implements IUserService {
       
    constructor(private userRepository : IUserRepository) {}
    
    async create(user : User) {
        if(!user) {
            throw new Error("Usuario invalido");
        }

        if(user.email == '') {
            throw new Error("O campo e-mail nao pode ser vazio.");
        }

        if(user.name == '') {
            throw new Error("O campo name nao pode ser vazio");
        }

        if(user.password == '') {
            throw new Error("O campo senha nao pode ser vazio");
        }

        const users = await this.userRepository.create(user)
        return users;
    }

    async findByEmail(email: string) {
        return this.userRepository.findByEmail(email);
    }
}