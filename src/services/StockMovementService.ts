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

        const validTypes = ['entrada', 'saida', 'ajuste'];
        if (!validTypes.includes(movement.movement_type)) {
            throw new Error('Tipo de movimentação inválido. Use: entrada, saida ou ajuste.');
        }

        if (movement.movement_type === 'saida' && product.stock < movement.quantity) {
            throw new Error(`Estoque insuficiente para saída. Estoque atual: ${product.stock}, quantidade a ser removida: ${movement.quantity}`);
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