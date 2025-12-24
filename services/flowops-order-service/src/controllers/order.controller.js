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

    const totalAmount = items.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );

    const order = await Order.create({
      customer,
      address,
      items,
      totalAmount,
      status,
    });

    return res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /orders/:id
 * Update an existing order
 */
const updateOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // business rule: completed orders are immutable
    if (order.status === "Completed") {
      return res.status(400).json({
        message: "Completed orders cannot be updated",
      });
    }

    // prevent manual total manipulation
    delete updates.totalAmount;

    Object.assign(order, updates);

    // recompute total if items updated
    if (updates.items) {
      order.totalAmount = updates.items.reduce(
        (sum, item) => sum + item.qty * item.price,
        0
      );
    }

    await order.save();

    res.json(order);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /orders/:id
 * Cancel an order
 */
const cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // business rules
    if (order.status === "Completed") {
      return res.status(400).json({
        message: "Completed orders cannot be cancelled",
      });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({
        message: "Order is already cancelled",
      });
    }

    order.status = "Cancelled";
    await order.save();

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getOrders,
  createOrder,
  updateOrder,
  cancelOrder
};
