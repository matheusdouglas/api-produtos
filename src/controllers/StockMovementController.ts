import { Request, Response } from 'express';
import { StockMovementService } from '../services/StockMovementService';
import { NewStockMovement } from '../models/StockMovement';

export class StockMovementController {
    constructor(private stockMovementService: StockMovementService) {}

    async create(req: Request, res: Response) {
        try {
            const { product_id, quantity, movement_type } = req.body as NewStockMovement;
            const movement = await this.stockMovementService.create({ product_id, quantity, movement_type });
            res.status(201).json(movement);
        } catch (error: any) {
            if (error.message === 'Produto não encontrado para movimentação de estoque.') {
                res.status(404).json({ error: error.message });
            } else if (error.message === 'Estoque insuficiente para saída.') {
                res.status(400).json({ error: error.message });
            } else {
                res.status(400).json({ error: error.message });
            }
        }
    }

    async findByProduct(req: Request, res: Response) {
        try {
            const product_id = Number(req.params.product_id);
            const movements = await this.stockMovementService.findByProduct(product_id);
            res.status(200).json(movements);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const movements = await this.stockMovementService.findAll();
            res.status(200).json(movements);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }
} 