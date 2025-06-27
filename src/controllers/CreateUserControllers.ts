import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import bcrypt from 'bcryptjs';



export class CreateUserController {

    constructor(private userService: UserService) { }


    async create(req: Request, res: Response) {
        try {
            const { name, email, password } = req.body;
            const passwordHashed = bcrypt.hashSync(password, 10)
            // Verificar se o usuário já existe
            const existingUser = await this.userService.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'E-mail já cadastrado' });
            }
            await this.userService.create({ name, email, password: passwordHashed })
            res.status(201).json({ message: 'Usuário criado com sucesso' });
        } catch (error: any) {
            res.status(400).send({ error: error.message })

        }
    }
}