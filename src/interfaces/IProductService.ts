import { newProduct, Product } from '../models/Product';

export interface IProductService {
    create(product: newProduct): Promise<Product>;
    findAll(): Promise<Product[]>;
    findById(id: number): Promise<Product>;
    findByCategory(category: string): Promise<Product[] | undefined>;
    delete(id: number): Promise<Product | undefined>;
    update(product: newProduct, id: number): Promise<Product | undefined>;
}
