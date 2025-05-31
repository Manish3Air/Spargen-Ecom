const express = require("express");
const Product = require("../models/Product.js");
const router = express.Router();
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController.js");
const { protect, isAdmin } = require("../middlewares/authMiddleware.js");


router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query) {
    return res.status(400).json({ message: "Query parameter is required" });
  }
  try {
    const regex = new RegExp(query, "i");
    const products = await Product.find({ name: regex }).limit(20);
    res.json(products);
  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      stack: error.stack,
    });
  }
});
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", protect, isAdmin, createProduct);
router.put("/:id", protect, isAdmin, updateProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);


// GET /api/search?query=somekeyword






module.exports = router;
