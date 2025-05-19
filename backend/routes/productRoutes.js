const express = require("express");
const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController.js");
const { protect, isAdmin } = require("../middlewares/authMiddleware.js"); // Coming soon

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", protect, isAdmin, createProduct);
router.put("/:id",  protect, isAdmin,  updateProduct);
router.delete("/:id",  protect, isAdmin,  deleteProduct);

module.exports = router;
