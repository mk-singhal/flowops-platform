const Order = require("../models/order.model");
const redis = require("../config/redis");
const { invalidateOrdersCache } = require("../utils/cache");
const { acquireLock, releaseLock } = require("../utils/lock");
const { ordersList, orderLock } = require("../utils/redisKeys");
const { publishEvent } = require("../kafka/producer");
const { v4: uuidv4 } = require("uuid");

/**
 * GET /orders
 * Fetch orders with pagination
 */

const CACHE_TTL = 60; // seconds

const getOrders = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 10, 100);
    const skip = (page - 1) * limit;

    const cacheKey = ordersList(page, limit);

    // Try Redis
    let cached = null;

    try {
      cached = await redis.get(cacheKey);
    } catch (err) {
      console.error("Redis read failed:", err.message);
    }

    if (cached) {
      console.log("Serving orders from Redis cache");
      return res.json(JSON.parse(cached));
    }

    // Fallback to Mongo
    console.log("Fetching orders from MongoDB");

    const [orders, total] = await Promise.all([
      Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Order.countDocuments(),
    ]);

    const response = {
      data: orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    // Store in Redis
    try {
      await redis.set(cacheKey, JSON.stringify(response), "EX", CACHE_TTL);
    } catch (err) {
      console.error("Redis write failed:", err.message);
    }

    res.json(response);
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

    const order = await Order.create({
      customer,
      address,
      items,
      status,
    });

    const event = {
      eventId: uuidv4(),
      eventType: "ORDER_CREATED",
      timestamp: new Date().toISOString(),
      payload: {
        orderId: order.id,
        items: order.items.map((item) => ({
          sku: item.sku,
          qty: item.qty,
        })),
      },
    };

    publishEvent(event);

    try {
      await invalidateOrdersCache();
    } catch (err) {
      console.error("Cache invalidation failed:", err.message);
    }

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
  const { id } = req.params;
  const lockKey = orderLock(id);

  let lockAcquired;

  try {
    lockAcquired = await acquireLock(lockKey);
  } catch (err) {
    return res.status(503).json({
      message: "Order updates temporarily unavailable",
      reason: "Locking service unavailable",
    });
  }

  if (!lockAcquired) {
    return res.status(409).json({
      message: "Order is being updated, please try again",
    });
  }

  try {
    // const { id } = req.params;
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

    const allowedFields = ["customer", "address", "items", "status"];

    allowedFields.forEach((field) => {
      if (updates[field] !== undefined) {
        order[field] = updates[field];
      }
    });

    await order.save();

    try {
      await invalidateOrdersCache();
    } catch (err) {
      console.error("Cache invalidation failed:", err.message);
    }

    res.json(order);
  } catch (err) {
    next(err);
  } finally {
    await releaseLock(lockKey);
  }
};

/**
 * DELETE /orders/:id
 * Cancel an order
 */
const cancelOrder = async (req, res, next) => {
  const { id } = req.params;
  const lockKey = orderLock(id);

  let lockAcquired;

  try {
    lockAcquired = await acquireLock(lockKey);
  } catch (err) {
    return res.status(503).json({
      message: "Order updates temporarily unavailable",
      reason: "Locking service unavailable",
    });
  }

  if (!lockAcquired) {
    return res.status(409).json({
      message: "Order is being updated, please try again",
    });
  }

  try {
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

    const event = {
      eventId: uuidv4(),
      eventType: "ORDER_CANCELLED",
      timestamp: new Date().toISOString(),
      payload: {
        orderId: order.id,
      },
    };

    publishEvent(event);

    try {
      await invalidateOrdersCache();
    } catch (err) {
      console.error("Cache invalidation failed:", err.message);
    }

    res.json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (err) {
    next(err);
  } finally {
    await releaseLock(lockKey);
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrder,
  cancelOrder,
};
