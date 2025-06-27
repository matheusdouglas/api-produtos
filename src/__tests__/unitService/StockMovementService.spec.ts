import { StockMovementService } from '../../services/StockMovementService';
import { StockMovementRepository } from '../../repositories/StockMovementRepository';
import { ProductRepository } from '../../repositories/ProductRepository';
import { NewStockMovement, MovementType } from '../../models/StockMovement';

jest.mock('../../repositories/StockMovementRepository');
jest.mock('../../repositories/ProductRepository');

describe('StockMovementService', () => {
  let stockMovementRepository: jest.Mocked<StockMovementRepository>;
  let productRepository: jest.Mocked<ProductRepository>;
  let service: StockMovementService;

  beforeEach(() => {
    stockMovementRepository = new StockMovementRepository() as jest.Mocked<StockMovementRepository>;
    productRepository = new ProductRepository() as jest.Mocked<ProductRepository>;
    service = new StockMovementService(stockMovementRepository, productRepository);
  });

  it('deve criar uma movimentação de estoque se o produto existir', async () => {
    const movement: NewStockMovement = {
      product_id: 1,
      quantity: 10,
      movement_type: MovementType.ENTRADA
    };
    productRepository.findById.mockResolvedValue({ id: 1 } as any);
    stockMovementRepository.create.mockResolvedValue({ id: 1, ...movement, created_at: new Date() } as any);

    const result = await service.create(movement);
    expect(productRepository.findById).toHaveBeenCalledWith(1);
    expect(stockMovementRepository.create).toHaveBeenCalledWith(movement);
    expect(result).toHaveProperty('id');
    expect(result.product_id).toBe(1);
  });

  it('deve lançar erro ao criar movimentação para produto inexistente', async () => {
    const movement: NewStockMovement = {
      product_id: 999,
      quantity: 5,
      movement_type: MovementType.SAIDA
    };
    productRepository.findById.mockResolvedValue(undefined);

    await expect(service.create(movement)).rejects.toThrow('Produto não encontrado para movimentação de estoque.');
    expect(productRepository.findById).toHaveBeenCalledWith(999);
    expect(stockMovementRepository.create).not.toHaveBeenCalled();
  });

  it('deve listar todas as movimentações', async () => {
    const mockMovements = [
      { id: 1, product_id: 1, quantity: 10, movement_type: MovementType.ENTRADA, created_at: new Date() },
      { id: 2, product_id: 1, quantity: -5, movement_type: MovementType.SAIDA, created_at: new Date() }
    ];
    stockMovementRepository.findAll.mockResolvedValue(mockMovements as any);

    const result = await service.findAll();
    expect(stockMovementRepository.findAll).toHaveBeenCalled();
    expect(result).toHaveLength(2);
  });
}); 