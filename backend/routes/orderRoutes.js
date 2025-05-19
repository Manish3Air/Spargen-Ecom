const express = require('express');
const { createOrder, getUserOrders, getAllOrders } = require('../controllers/orderController.js');
const { protect, isAdmin } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/', protect, createOrder);
router.get('/my-orders', protect, getUserOrders);
router.get('/', protect, isAdmin, getAllOrders);

module.exports = router;
