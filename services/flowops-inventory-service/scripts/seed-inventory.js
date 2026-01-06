const mongoose = require("mongoose");
const Inventory = require("../src/models/inventory.model");

const seed = async () => {
  await mongoose.connect("mongodb://localhost:27017/flowops-inventory");

  await Inventory.insertMany([
    { sku: "SKU-1", availableQty: 100, reservedQty: 0 },
    { sku: "SKU-2", availableQty: 50, reservedQty: 0 },
    { sku: "SKU-3", availableQty: 150, reservedQty: 0 },
  ]);

  console.log("Inventory seeded");
  process.exit(0);
};

seed();
