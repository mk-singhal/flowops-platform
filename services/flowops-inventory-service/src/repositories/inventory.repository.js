const Inventory = require("../models/inventory.model");

const findBySku = (sku) => {
  return Inventory.findOne({ sku });
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
  createInventory,
  updateQuantities,
};
