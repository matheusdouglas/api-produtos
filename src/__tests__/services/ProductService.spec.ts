import { expect, jest, describe, it } from '@jest/globals';
import { ProductService } from '../../services/ProductService';
import { IProductRepository } from '../../interfaces/IProductRepository';
import { newProduct, Product } from '../../models/Product';

describe('ProductService', () => {

  let mockRepository: jest.Mocked<IProductRepository>;
  let service: ProductService;
  let fakeNewProduct: newProduct;
  let fakeProduct: Product;

  beforeEach(() => {
    fakeNewProduct = {
      name: "Produto Teste",
      description: "Descrição",
      price: 100,
      category: "Categoria Teste"
    };

    fakeProduct = {
      id: 1,
      name: "Produto Teste",
      description: "Descrição",
      price: 100,
      category: "Categoria Teste"
    };

    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByCategory: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    service = new ProductService(mockRepository);
  });


  it('deve criar um novo produto com sucesso', async () => {
    mockRepository.create.mockResolvedValue(fakeProduct);

    const result = await service.create(fakeNewProduct);
    expect(result).toEqual(fakeProduct);
    expect(mockRepository.create).toHaveBeenCalledWith(fakeNewProduct);
  });

  it('Deve da erro ao tentar cadastrar usuario com name vazio', async () => {
    const productFake = { ...fakeNewProduct, name: "" }
    await expect(service.create(productFake)).rejects.toThrow("Product name is required")
  });

  it('Deve da erro ao tentar cadastrar usuario com categoria vazia', async () => {
    const productFake = { ...fakeNewProduct, category: "" }
    await expect(service.create(productFake)).rejects.toThrow("Product category is required")
  });

  it('Deve da erro ao tentar cadastrar usuario com descricao vazia', async () => {
    const productFake = { ...fakeNewProduct, description: "" }
    await expect(service.create(productFake)).rejects.toThrow("Product description is required")
  });

  it('Deve da erro ao tentar cadastrar um produto com o preco menor que 0', async () => {
    const productFake = { ...fakeNewProduct, price: -1 }
    await expect(service.create(productFake)).rejects.toThrow("Product price must be greater than 0")
  });

  it('Deve da erro ao tentar cadastrar um produto com o preco igual a 0', async () => {
    const productFake = { ...fakeNewProduct, price: 0 }
    await expect(service.create(productFake)).rejects.toThrow("Product price must be greater than 0")
  });
});
