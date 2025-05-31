// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const orderRoutes = require("./routes/orderRoutes");
const analyticsRoutes = require("./routes/analyticsRoute");
const userRoutes = require("./routes/userRoutes");
const cloudinaryRoutes = require("./routes/cloudinaryRoutes");

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_DEV_URL,    // e.g. http://localhost:3000
  process.env.FRONTEND_PROD_URL,   // e.g. https://yourproductiondomain.com
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // important if using cookies or Authorization headers
}));


app.use(express.json()); // Parse incoming JSON




// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);

app.use("/api/cloudinary", cloudinaryRoutes);



// Root route
app.get("/health", (req, res) => {
  // console.log("Root route accessed");
  res.send("✅ E-commerce API is running");
});




// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
