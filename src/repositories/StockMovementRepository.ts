import { client } from '../database/db';
import { NewStockMovement, StockMovement } from '../models/StockMovement';

export class StockMovementRepository {
    async create(movement: NewStockMovement): Promise<StockMovement> {
        const { product_id, quantity, movement_type } = movement;
        const result = await client.query(
            `INSERT INTO stock_movements (product_id, quantity, movement_type) VALUES ($1, $2, $3) RETURNING *`,
            [product_id, quantity, movement_type]
        );
        return result.rows[0];
    }

    async findByProduct(product_id: number): Promise<StockMovement[]> {
        const result = await client.query(
            `SELECT * FROM stock_movements WHERE product_id = $1 ORDER BY created_at DESC`,
            [product_id]
        );
        return result.rows;
    }

    async findAll(): Promise<StockMovement[]> {
        const result = await client.query(`SELECT * FROM stock_movements ORDER BY created_at DESC`);
        return result.rows;
    }
} 