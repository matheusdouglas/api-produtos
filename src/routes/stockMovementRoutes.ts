import { Router } from 'express';
import { StockMovementController } from '../controllers/StockMovementController';
import { StockMovementService } from '../services/StockMovementService';
import { StockMovementRepository } from '../repositories/StockMovementRepository';
import { ProductRepository } from '../repositories/ProductRepository';

const router = Router();
const stockMovementRepository = new StockMovementRepository();
const productRepository = new ProductRepository();
const stockMovementService = new StockMovementService(stockMovementRepository, productRepository);
const stockMovementController = new StockMovementController(stockMovementService);

router.post('/', (req, res) => stockMovementController.create(req, res));
router.get('/', (req, res) => stockMovementController.findAll(req, res));
router.get('/product/:product_id', (req, res) => stockMovementController.findByProduct(req, res));

export default router; 