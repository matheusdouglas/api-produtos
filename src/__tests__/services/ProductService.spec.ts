import { expect, jest, describe, it } from '@jest/globals';
import { ProductService } from '../../services/ProductService';
import { IProductRepository } from '../../interfaces/IProductRepository';
import { newProduct, Product } from '../../models/Product';

describe('ProductService', () => {
  it('deve criar um novo produto com sucesso', async () => {

    const fakeNewProduct: newProduct = {
      name: "Produto Teste",
      description: "Descrição",
      price: 100,
      category: "Categoria Teste"
    };
    // Segundo: o produto salvo, que tem ID (Product)
    const fakeProduct: Product = {
      id: 1,
      name: "Produto Teste",
      description: "Descrição",
      price: 100,
      category: "Categoria Teste"
    };
    // Mock do repositório
    const mockRepository: jest.Mocked<IProductRepository> = {
        create: jest.fn(),
        findAll: jest.fn(),
        findById: jest.fn(),
        findByCategory: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      };

    mockRepository.create.mockResolvedValue(fakeProduct);

    // Instanciar o service com o mock
    const service = new ProductService(mockRepository);

    // Act - chama o método
    const result = await service.create(fakeNewProduct);

    // Assert - verifica se voltou o esperado
    expect(result).toEqual(fakeProduct);
    expect(mockRepository.create).toHaveBeenCalledWith(fakeNewProduct);
  });
});
