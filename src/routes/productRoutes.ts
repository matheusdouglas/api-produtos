import { Router } from "express";
import { ProductController } from "../controllers/ProductControllers";
import { AuthControllers } from "../controllers/AuthControllers";
import { authMiddleware } from "../middleware/middleware";
import { ProductService } from "../services/ProductService";
import { ProductRepository } from "../repositories/ProductRepository";

const router = Router();

const productRepository = new ProductRepository
const productService = new ProductService(productRepository)
const productController = new ProductController(productService);


router.post("/product", authMiddleware, productController.create);
router.get("/products", authMiddleware, productController.findAll);
router.get("/products/:id", authMiddleware, productController.findById);
router.get('/products/category/:category', authMiddleware, productController.findByCategory);
router.delete("/products/:id", authMiddleware, productController.delete);
router.put("/products/:id", authMiddleware, productController.update);
export default router;

