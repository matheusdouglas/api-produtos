import { StockMovementRepository } from '../repositories/StockMovementRepository';
import { NewStockMovement, StockMovement } from '../models/StockMovement';
import { ProductRepository } from '../repositories/ProductRepository';

export class StockMovementService {
    constructor(
        private stockMovementRepository: StockMovementRepository,
        private productRepository: ProductRepository
    ) {}

    async create(movement: NewStockMovement): Promise<StockMovement> {
        // Validação: produto deve existir
        const product = await this.productRepository.findById(movement.product_id);
        if (!product) {
            throw new Error('Produto não encontrado para movimentação de estoque.');
        }
        return this.stockMovementRepository.create(movement);
    }

    async findByProduct(product_id: number): Promise<StockMovement[]> {
        return this.stockMovementRepository.findByProduct(product_id);
    }

    async findAll(): Promise<StockMovement[]> {
        return this.stockMovementRepository.findAll();
    }
} 