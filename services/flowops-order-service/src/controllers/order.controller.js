const Order = require("../models/order.model");

/**
 * GET /orders
 * Fetch orders with pagination
 */
const getOrders = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(),
    ]);

    res.json({
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /orders
 * Create a new order
 */
const createOrder = async (req, res, next) => {
  try {
    const { customer, address, items, status } = req.body;

    if (!customer || !address || !items || !items.length) {
      return res.status(400).json({
        message: "Invalid order payload",
      });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );

    const order = await Order.create({
      customer,
      address,
      items,
      totalAmount,
      status, // defaults to "Pending" if not sent
    });

    return res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getOrders,
  createOrder,
};
