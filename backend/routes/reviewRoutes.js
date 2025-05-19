const express = require('express');
const { addReview, getProductReviews } = require('../controllers/reviewController.js');
const { protect } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/:productId', protect, addReview);
router.get('/:productId', getProductReviews);

module.exports = router;
