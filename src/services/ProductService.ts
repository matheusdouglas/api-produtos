import { newProduct, Product } from "../models/Product";
import { IProductRepository } from "../interfaces/IProductRepository";
import { IProductService } from "../interfaces/IProductService";

export class ProductService implements IProductService {
    constructor(private productRepository: IProductRepository) { }


    async create(product: newProduct): Promise<Product> {
        if (product.name == '') {
            throw new Error('Product name is required');
        }

        if (product.price <= 0) {
            throw new Error('Product price must be greater than 0');
        }

        if (product.category == '') {
            throw new Error('Product category is required');
        }

        if (product.description == '') {
            throw new Error('Product description is required');
        }

        const newProduct = await this.productRepository.create(product);
        return newProduct;
    }

    async findAll(): Promise<Product[]> {
        const products = await this.productRepository.findAll();

        if (products.length === 0) {
            throw new Error('Nenhum produto cadastrado.');
        }

        return products;
    }

    async findById(id: number): Promise<Product> {

        if (!id || id <= 0 || isNaN(id)) {
            throw new Error("ID inválido");
        }


        const product = await this.productRepository.findById(id)

        if (product == undefined) {
            throw new Error("Produto não encontrado");
        }

        return product

    }


    async findByCategory(category: string): Promise<Product[] | undefined> {
        if (!category) {
            throw new Error("Categoria obrigatória");
        }

        const products = await this.productRepository.findByCategory(category);

        if (products?.length === 0) {
            throw new Error("Nenhum produto encontrado para essa categoria");
        }

        return products;
    }

    async delete(id: number): Promise<Product | undefined> {
        if (!id) {
            throw new Error("Id e obrigatório");
        }


        const product = await this.productRepository.delete(id)
        return product;
    }

    async update(product: newProduct, id: number): Promise<Product | undefined> {

        const products = await this.productRepository.findById(id)

        if (products == undefined) {
            throw new Error("Produto não encontrado");
        }

        if (!id || id <= 0 || isNaN(id)) throw new Error("ID inválido");
        if (!product.name) throw new Error("Nome é obrigatório");
        if (product.price <= 0) throw new Error("Preço deve ser maior que 0");
        if (!product.category) throw new Error("Categoria é obrigatória");

        return this.productRepository.update(product, id);
    }
}