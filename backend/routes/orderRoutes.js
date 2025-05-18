import express from 'express';
import { createOrder, getUserOrders, getAllOrders } from '../controllers/orderController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/', protect, isAdmin, getAllOrders);

export default router;
