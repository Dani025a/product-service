import express from 'express';
import { createProductController, getProducts } from '../controllers/productController';
import { authenticateAdmin } from '../middleware/authMiddleware';
import { validateProductQuery } from '../middleware/validateProductQuery';

const router = express.Router();

router.post('/products', authenticateAdmin, createProductController);
router.get('/products', validateProductQuery, getProducts);

export default router;
