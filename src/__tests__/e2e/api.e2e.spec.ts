import request from 'supertest';
import express from 'express';
import productRoutes from '../../routes/productRoutes';
import authRouter from '../../routes/authRoutes';
import stockMovementRoutes from '../../routes/stockMovementRoutes';
import { client } from '../../database/db';

const app = express();
app.use(express.json());
app.use('/api', productRoutes);
app.use('/api', authRouter);
app.use('/api/stock-movements', stockMovementRoutes);

describe('API E2E Tests', () => {
  jest.setTimeout(20000);
  let authToken: string;
  let testProductId: number;

  beforeAll(async () => {
    await client.connect();
    // Setup: criar usuário e obter token
    const userData = {
      name: 'E2E Test User',
      email: 'e2e@example.com',
      password: 'password123'
    };

    // Registrar usuário
    await request(app)
      .post('/api/register')
      .send(userData);

    // Fazer login
    const loginResponse = await request(app)
      .post('/api/login')
      .send({
        email: 'e2e@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
  });

  describe('Stock Movement Flow', () => {
    let stockProductId: number;

    beforeEach(async () => {
      // Criar produto para testes de estoque
      const productData = {
        name: 'Stock Test Product',
        description: 'Product for stock testing',
        price: 50.00,
        category: 'Test',
        stock: 100
      };

      const createResponse = await request(app)
        .post('/api/product')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData);

      stockProductId = createResponse.body.id;
    });

    it('should handle stock entry movement', async () => {
      const movementData = {
        product_id: stockProductId,
        quantity: 25,
        movement_type: 'entrada'
      };

      const response = await request(app)
        .post('/api/stock-movements')
        .send(movementData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.product_id).toBe(stockProductId);
      expect(response.body.quantity).toBe(25);

      // Verificar se o estoque do produto foi atualizado
      const productResponse = await request(app)
        .get(`/api/products/${stockProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(productResponse.body.stock).toBe(125); // 100 + 25
    });

    it('should handle stock exit movement', async () => {
      const movementData = {
        product_id: stockProductId,
        quantity: -15,
        movement_type: 'saida'
      };

      const response = await request(app)
        .post('/api/stock-movements')
        .send(movementData)
        .expect(201);

      expect(response.body.quantity).toBe(-15);

      // Verificar se o estoque do produto foi atualizado
      const productResponse = await request(app)
        .get(`/api/products/${stockProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(productResponse.body.stock).toBe(85); // 100 - 15
    });

    it('should list stock movements for a product', async () => {
      // Criar algumas movimentações
      const movements = [
        { product_id: stockProductId, quantity: 10, movement_type: 'entrada' },
        { product_id: stockProductId, quantity: -5, movement_type: 'saida' },
        { product_id: stockProductId, quantity: 20, movement_type: 'entrada' }
      ];

      for (const movement of movements) {
        await request(app)
          .post('/api/stock-movements')
          .send(movement);
      }

      // Listar movimentações do produto
      const response = await request(app)
        .get(`/api/stock-movements/product/${stockProductId}`)
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body.every((m: any) => m.product_id === stockProductId)).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return 401 for protected routes without token', async () => {
      await request(app)
        .get('/api/products')
        .expect(401);
    });

    it('should return 401 for protected routes with invalid token', async () => {
      await request(app)
        .get('/api/products')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('should return 404 for non-existent product', async () => {
      await request(app)
        .get('/api/products/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 400 for invalid product data', async () => {
      const invalidData = {
        name: '',
        description: 'Test',
        price: -100, // Preço negativo
        category: 'Test',
        stock: -10 // Estoque negativo
      };

      await request(app)
        .post('/api/product')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData)
        .expect(400);
    });

    it('should return 404 for stock movement with non-existent product', async () => {
      const movementData = {
        product_id: 99999,
        quantity: 10,
        movement_type: 'entrada'
      };

      await request(app)
        .post('/api/stock-movements')
        .send(movementData)
        .expect(404);
    });
  });

  describe('Performance Tests', () => {
    it('should handle multiple concurrent requests', async () => {
      const concurrentRequests = 10;
      const promises = [];

      for (let i = 0; i < concurrentRequests; i++) {
        promises.push(
          request(app)
            .get('/api/products')
            .set('Authorization', `Bearer ${authToken}`)
        );
      }

      const responses = await Promise.all(promises);
      
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    });

    it('should respond within acceptable time limit', async () => {
      const startTime = Date.now();
      
      await request(app)
        .get('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const endTime = Date.now();
      const responseTime = endTime - startTime;

      expect(responseTime).toBeLessThan(1000); // Menos de 1 segundo
    });
  });

  afterAll(async () => {
    await client.end();
  });
}); 