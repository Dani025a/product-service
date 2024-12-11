import express from 'express';
import { viewProduct } from '../controllers/productViewController';

const router = express.Router();

router.get('/product/view/:id', viewProduct);

export default router;
