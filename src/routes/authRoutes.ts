import { Router } from 'express';
import { AuthControllers } from '../controllers/AuthControllers';
import { CreateUserController } from '../controllers/CreateUserControllers';
import { UserService } from '../services/UserService';
import { UserRepository } from '../repositories/UserRepository';

const authRouter = Router();
const authController = new AuthControllers();

const createUserRepository = new UserRepository
const createUserService = new UserService(createUserRepository)
const createUserController = new CreateUserController(createUserService)

authRouter.post('/login', async (req, res) => {
    await authController.signIn(req, res);
  });

authRouter.post('/register', async (req, res) => {
    await createUserController.create(req, res);
});

export default authRouter;
