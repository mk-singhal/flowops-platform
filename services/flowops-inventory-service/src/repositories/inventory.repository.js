const Inventory = require("../models/inventory.model");

const findBySku = (sku) => {
  return Inventory.findOne({ sku });
};

const findAll = async ({ skip, limit }) => {
  return Inventory.find({})
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit);
};

const countAll = async () => {
  return Inventory.countDocuments();
};

const createInventory = ({ sku, availableQty, reservedQty }) => {
  return Inventory.create({
    sku,
    availableQty,
    reservedQty,
  });
};

const updateQuantities = (sku, availableQty, reservedQty) => {
  return Inventory.findOneAndUpdate(
    { sku },
    { availableQty, reservedQty },
    { new: true }
  );
};

module.exports = {
  findBySku,
  findAll,
  countAll,
  createInventory,
  updateQuantities,
};
