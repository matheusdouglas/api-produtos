import { expect, jest, describe, it } from '@jest/globals';
import { ProductController } from '../../controllers/ProductControllers';
import { IProductService } from '../../interfaces/IProductService';

describe('ProductController', () => {
    let fakeNewProduct: any;
    let fakeProductWithId: any;
    let req: any;
    let res: any;
    let productService: jest.Mocked<IProductService>;
    let controller: ProductController;

    beforeEach(() => {
        fakeNewProduct = { ...fakeNewProduct };
        fakeProductWithId = { id: 1, ...fakeNewProduct };

        req = { body: fakeNewProduct } as any;
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        } as any;

        productService = {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByCategory: jest.fn(),
            delete: jest.fn(),
            update: jest.fn()
        };

        controller = new ProductController(productService);
    });


    it('Deve criar um novo produto e retornar 201', async () => {
        productService.create.mockResolvedValue(fakeProductWithId);

        await controller.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(fakeProductWithId);
        expect(productService.create).toHaveBeenCalledWith(fakeNewProduct);
    });

    it('Deve retornar 400 se o service lançar erro', async () => {
        productService.create.mockRejectedValue(new Error("Erro simulado"));

        await controller.create(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Erro simulado" });
    });

});