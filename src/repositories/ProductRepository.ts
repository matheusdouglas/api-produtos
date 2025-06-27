import { client } from '../database/db';
import { IProductRepository } from '../interfaces/IProductRepository';
import { newProduct, Product } from '../models/Product';


export class ProductRepository implements IProductRepository {
    async create(product: newProduct): Promise<Product> {

        const query = `INSERT INTO products (name, description, price, category, stock)
                       VALUES ($1, $2, $3, $4, $5)
                       RETURNING *;
                      `
        const products = await client.query(query, [product.name, product.description, product.price, product.category, product.stock])

        return products.rows[0];
    }

    async findAll(): Promise<Product[]> {

        const query = `SELECT * FROM products`
        const result = await client.query(query);

        return result.rows

    }

    async findById(id: number): Promise<Product | undefined> {

        const query = `SELECT * FROM products WHERE id = $1`;
        const result = await client.query(query, [id]);
        return result.rows[0];
    }

    async findByCategory(category: string): Promise<Product[] | undefined> {
        const query = `SELECT * FROM products WHERE category ILIKE $1;`;
        const result = await client.query(query, [category]);
        return result.rows;
    }

    async delete(id: number): Promise<Product | undefined> {
        const query = `DELETE FROM products WHERE id = $1 RETURNING *`;
        const result = await client.query(query, [id]);
        return result.rows[0] || undefined;
    }

    async update(product: newProduct, id: number): Promise<Product | undefined> {

        const query = `UPDATE products
                       SET name = $1, description = $2, price = $3, category = $4, stock = $5
                       WHERE id = $6
                       RETURNING *;
                      `
        const products = await client.query(query, [product.name, product.description, product.price, product.category, product.stock, id])

        return products.rows[0];
    }

} 
