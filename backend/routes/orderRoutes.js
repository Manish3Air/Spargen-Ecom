const express = require('express');
const { createOrder, getUserOrders, getAllOrders,updateOrderStatus,updatePaymentStatus } = require('../controllers/orderController.js');
const { protect, isAdmin } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/', protect, isAdmin, getAllOrders);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);
router.put('/:id/pay',protect,updatePaymentStatus)

module.exports = router;
