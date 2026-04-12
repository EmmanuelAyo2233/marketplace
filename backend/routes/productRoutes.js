import express from 'express';
import {
  getProducts,
  getProductById,
  compareProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
} from '../controllers/productController.js';
import { protect, vendor } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/compare', compareProducts); // Needs to be above /:id
router.get('/me', protect, vendor, getMyProducts);

router.route('/')
  .get(getProducts)
  .post(protect, vendor, upload.single('image'), createProduct);

router.route('/:id')
  .get(getProductById)
  .put(protect, vendor, upload.single('image'), updateProduct)
  .delete(protect, vendor, deleteProduct);

export default router;
