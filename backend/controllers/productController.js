const Product = require("../models/Product.js");
const Review = require("../models/Review.js");
const User = require("../models/User.js");

// @desc Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc Get a single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc Create a new product (admin only)
const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// @desc Update a product (admin only)
const updateProduct = async (req, res) => {
  console.log("Api hit");
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ error: "Product not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc Delete a product (admin only)
const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Get all reviews for a product
// @route   GET /api/products/:id/reviews
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id }).sort({
      createdAt: -1,
    });
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

// @desc    Create a new review
// @route   POST /api/products/:id/reviews
const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const alreadyReviewed = await Review.findOne({
      productId: req.params.id,
      userId: req.user._id,
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: "Product already reviewed" });
    }

    const user = await User.findById(req.user._id);

    const review = new Review({
      productId: req.params.id,
      userId: req.user._id,
      username: user.name, // Get username from user model
      rating: Number(rating),
      comment,
    });

    await review.save();

    // Update product rating
    const reviews = await Review.find({ productId: req.params.id });
    product.numReviews = reviews.length;
    product.rating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added", review });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ error: "Server error while creating review" });
  }
};

// @desc    Update a review
// @route   PUT /api/products/:id/reviews/:reviewId
const updateProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.productId.toString() !== product._id.toString()) {
      return res
        .status(400)
        .json({ message: "Review does not belong to this product" });
    }

    if (review.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to edit this review" });
    }

    review.rating = Number(rating) || review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();

    const reviews = await Review.find({ productId: product._id });
    product.rating =
      reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
    await product.save();

    res.json({ message: "Review updated", review: updatedReview });
  } catch (err) {
    console.error("Error updating review:", err);
    res.status(500).json({ error: "Server error while updating review" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductReviews,
  createProductReview,
  updateProductReview,
};
