import { Request, Response } from 'express';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


export class AuthControllers {

    async signIn(req: Request, res: Response) {
        try {
          const repository = new UserRepository();

          const { email, password } = req.body;
      
          const findEmail = await repository.findByEmail(email);
      
          if (!findEmail || !(await bcrypt.compare(password, findEmail.password))) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
          }
      
          const token = jwt.sign(
            { id: findEmail.id, email: findEmail.email },
            "seu_segredo_supersecreto", // depois podemos jogar isso numa variável de ambiente
            { expiresIn: "1h" }
          );
      
          return res.status(200).json({ token });
        } catch (error: any) {
          return res.status(500).json({ error: error.message });
        }
      }
      
}