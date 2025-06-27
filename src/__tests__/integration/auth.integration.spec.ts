import request from 'supertest';
import express from 'express';
import { AuthControllers } from '../../controllers/AuthControllers';
import { CreateUserController } from '../../controllers/CreateUserControllers';
import { UserService } from '../../services/UserService';
import { UserRepository } from '../../repositories/UserRepository';
import { client } from '../../database/db';

const app = express();
app.use(express.json());

const authController = new AuthControllers();
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const createUserController = new CreateUserController(userService);

// Rotas de teste
app.post('/api/register', async (req, res) => {
  await createUserController.create(req, res);
});

app.post('/api/login', async (req, res) => {
  await authController.signIn(req, res);
});

beforeAll(async () => {
  await client.connect();
});
afterAll(async () => {
  await client.end();
});

describe('Auth Integration Tests', () => {
  jest.setTimeout(20000);
  beforeEach(async () => {
    // Limpar banco de dados de teste
    // await clearTestDatabase();
  });

  describe('POST /api/register', () => {
    it('should return error for invalid data', async () => {
      const invalidData = {
        name: '',
        email: 'invalid-email',
        password: '123' // Senha muito curta
      };

      const response = await request(app)
        .post('/api/register')
        .send(invalidData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/login', () => {
    beforeEach(async () => {
      // Criar usuário para teste
      const userData = {
        name: 'Login Test User',
        email: 'login@example.com',
        password: 'password123'
      };

      await request(app)
        .post('/api/register')
        .send(userData);
    });

    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
    });

    it('should return error for invalid credentials', async () => {
      const invalidLoginData = {
        email: 'login@example.com',
        password: 'wrongpassword'
      };

      const response = await request(app)
        .post('/api/login')
        .send(invalidLoginData)
        .expect(401);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('inválidas');
    });

    it('should return error for non-existent user', async () => {
      const nonExistentUser = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/login')
        .send(nonExistentUser)
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
}); 