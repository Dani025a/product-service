import express from 'express';
import {
  getAllCategories,
  getMainCategoryById,
  getSubCategories,
  getSubSubCategories,
} from '../controllers/categoryController';

const router = express.Router();

router.get('/all', getAllCategories);
router.get('/main/:id', getMainCategoryById);
router.get('/sub', getSubCategories);
router.get('/subsub', getSubSubCategories);

export default router;
