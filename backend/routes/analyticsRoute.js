const express = require('express');
const { getDashboardStats } = require('../controllers/analyticsController.js');
const { protect, isAdmin } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/', protect, isAdmin, getDashboardStats);

module.exports = router;
