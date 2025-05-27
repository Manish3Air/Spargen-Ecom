// routes/cloudinaryRoutes.js
const express = require("express");
const router = express.Router();
const cloudinary = require("cloudinary").v2;
const { protect, isAdmin } = require("../middlewares/authMiddleware");
require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Generate signature
router.get("/signature",protect,isAdmin, (req, res) => {
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = {
    timestamp,
    upload_preset: "Spargen_Products_Images", // Must be signed type in Cloudinary
  };

  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);

  res.json({
    timestamp,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    uploadPreset: "Spargen_Products_Images",
  });

});

// Delete image by public_id
router.delete("/delete-image",protect,isAdmin, async (req, res) => {

  try {
    const { public_id } = req.body;
    if (!public_id) return res.status(400).json({ message: "public_id required" });

    await cloudinary.uploader.destroy(public_id);

    res.json({ success: true, message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
