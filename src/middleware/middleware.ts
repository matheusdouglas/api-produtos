import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: "Token não fornecido" });
        return;
    }

    const [, token] = authHeader.split(' ');

    try {
        jwt.verify(token, "seu_segredo_supersecreto");
        next();
    } catch (error) {
        res.status(401).json({ error: "Token inválido" });
        return;
    }
}
