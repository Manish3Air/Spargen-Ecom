const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },

    items: [
      {
        _id: String,
        name: String,
        price: Number,
        quantity: Number,
        image: String,
      },
    ],

    total: { type: Number, required: true },        // original price before discount
    actualTotal: { type: Number, required: true },  // after applying discount

    shippingInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      phone:{type: String, required: true},
      zip: { type: String, required: true },
    },

    orderstatus: {
      type: String,
      enum: ["Placed", "Shipped", "Out for Delivery", "Delivered"],
      default: "Placed",
    },
    paymentstatus: {
      type: String,
      default: "Paid",
    },
    paidAt:{ type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
