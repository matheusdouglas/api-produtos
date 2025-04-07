import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import bcrypt from 'bcryptjs';



export class CreateUserController {

    constructor(private userService: UserService) { }


    async create(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            const passwordHashed = bcrypt.hashSync(password, 10)

            const createUser = await this.userService.create({ name, email, password: passwordHashed })

            res.status(200).json(createUser)
        } catch (error: any) {
            res.status(400).send({ error: error.message })

        }
    }
}