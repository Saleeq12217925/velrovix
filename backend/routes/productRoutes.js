import express from 'express';
import { getProductBySlug, getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, adminOnly, createProduct);
router.route('/:slug').get(getProductBySlug);
router.route('/:id').put(protect, adminOnly, updateProduct).delete(protect, adminOnly, deleteProduct);

export default router;
