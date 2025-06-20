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


router.post("/product", authMiddleware, async (req, res) => { await productController.create(req, res); });
router.get("/products", authMiddleware, async (req, res) => { await productController.findAll(req, res); });
router.get("/products/:id", authMiddleware, async (req, res) => { await productController.findById(req, res); });
router.get('/products/category/:category', authMiddleware, async (req, res) => { await productController.findByCategory(req, res); });
router.delete("/products/:id", authMiddleware, async (req, res) => { await productController.delete(req, res); });
router.put("/products/:id", authMiddleware, async (req, res) => { await productController.update(req, res); });
export default router;

