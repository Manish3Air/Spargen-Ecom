const { Review } = require('../models/Review.js');

 const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = new Review({
      productId: req.params.productId,
      userId: req.user.id,
      rating,
      comment,
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

 const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).populate('userId', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  addReview,
  getProductReviews,
};