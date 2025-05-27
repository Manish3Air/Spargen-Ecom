const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    const totalRevenueAgg = await Order.aggregate([
      { $group: { _id: null, revenue: { $sum: "$total" } } }
    ]);
    const totalRevenue = totalRevenueAgg[0]?.revenue || 0;

    // Monthly revenue (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1); // Start of the month

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$total" }
        }
      },
      {
        $sort: { "_id": 1 }
      }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyData = Array(6).fill(0).map((_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - 5 + i);
      return {
        month: monthNames[month.getMonth()],
        revenue: 0
      };
    });

    monthlyRevenue.forEach(entry => {
      const index = monthlyData.findIndex(
        d => d.month === monthNames[entry._id - 1]
      );
      if (index > -1) monthlyData[index].revenue = entry.total;
    });

    // Order Status Distribution — return as an array
    const orderStatusCounts = await Order.aggregate([
      {
        $group: {
          _id: "$orderstatus",
          count: { $sum: 1 }
        }
      }
    ]);

    const allStatuses = ["Placed", "Shipped", "Out for Delivery", "Delivered"];

    const orderStatusDistribution = allStatuses.map(status => {
      const found = orderStatusCounts.find(entry => entry._id === status);
      return {
        status,
        count: found ? found.count : 0
      };
    });

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      monthlyRevenue: monthlyData,
      orderStatusDistribution
    });
  } catch (err) {
    console.error("Dashboard Stats Error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getDashboardStats
};
