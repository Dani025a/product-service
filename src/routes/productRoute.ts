import express from 'express';
import productController from "../controllers/productController";
import { validateProductQuery } from '../middleware/validateProductQuery';

const router = express.Router();

router.post('/products', validateProductQuery, productController.getProducts);
router.get('/products', productController.getAllProducts);
router.get('/product/:id', productController.getProductById);
router.get('/:id', productController.getProduct);
export default router;
