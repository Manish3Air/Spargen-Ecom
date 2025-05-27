const Order = require("../models/Order");

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private (User)
 const createOrder = async (req, res) => {
  try {
    const { items, total, actualTotal, shippingInfo } = req.body;
    let { orderstatus = "Placed" } = req.body;
    let {paymentstatus = "Paid via UPI"} = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const order = new Order({
      user: req.user._id,
      userEmail: req.user.email,
      items,
      total,
      actualTotal,
      shippingInfo,
      orderstatus,
      paymentstatus,
    });

    const savedOrder = await order.save();

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ message: "Failed to create order" });
  }
};

// @desc    Get current user's orders
// @route   GET /api/orders/my-orders
// @access  Private (User)
 const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
 const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user", "name email").sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error fetching all orders:", err);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

// @desc    Update order status (Admin only)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
 const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
console.log("api hit");
  const validStatuses = ["Placed", "Shipped", "Out for Delivery", "Delivered"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderstatus = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};


const updatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.paymentstatus = "Paid via UPI";
    order.paidAt = new Date();
    order.orderstatus = "Placed"; // if needed

    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


module.exports ={
getAllOrders,
getUserOrders,
createOrder,
updateOrderStatus,
updatePaymentStatus,
}
