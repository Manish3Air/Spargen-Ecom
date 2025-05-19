const { Order } = require('../models/Order.js');

 const createOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    const order = new Order({
      user: req.user.id,
      products,
      totalAmount,
    });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

 const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

 const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name').populate('products.product');
    res.json(orders);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getAllOrders,
};
