const Order = require("../models/order.model");

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
  createOrder,
};
