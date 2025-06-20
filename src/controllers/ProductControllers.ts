import { Request, Response } from 'express';
import { newProduct } from '../models/Product';
import { IProductService } from '../interfaces/IProductService';

export class ProductController {
    constructor(private productService: IProductService) { }

    async create(req: Request, res: Response) {
        try {
            const { name, price, category, description, stock } = req.body as newProduct;

            const product = await this.productService.create({ name, price, category, description, stock });
            res.status(201).json(product);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }

    async findAll(req: Request, res: Response) {
        try {
            const products = await this.productService.findAll();
            res.status(200).json(products);
        } catch (error: any) {
            if (error.message === 'Nenhum produto cadastrado.') {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erro interno do servidor.' });
            }
        }
    }

    async findById(req: Request, res: Response) {
        try {

            const id = req.params.id

            const productId = Number(id);

            const products = await this.productService.findById(productId);

            res.status(200).json(products)

        } catch (error: any) {
            res.status(400).json({ error: error.message })
        }
    }

    async findByCategory(req: Request, res: Response) {
        try {
            const category = req.params.category;

            const products = await this.productService.findByCategory(category);
            res.status(200).json(products);
        } catch (error: any) {
            res.status(400).send({ error: error.message });
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const params = req.params.id
            const product = Number(params)
            const result = await this.productService.delete(product);
            if (!result) {
                return res.status(404).json({ error: 'Produto não encontrado' });
            }
            res.status(200).json(result)
        } catch (error: any) {
            res.status(400).send({ error: error.message })
        }
    }

    async update(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const dados = req.body; // tipo newProduct


            const produtoAtualizado = await this.productService.update(dados, id);

            res.status(200).json(produtoAtualizado);
        } catch (error: any) {
            res.status(400).json({ error: error.message });
        }
    }


}