const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    availableQty: {
      type: Number,
      required: true,
      min: 0,
    },
    reservedQty: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Inventory", inventorySchema);
