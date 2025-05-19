const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    images: [
      {
        type: String, // image URLs
      },
    ],
    stock: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
    },
    ratings: {
      type: Number,
      default: 4.5,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

module.exports = Product; 
