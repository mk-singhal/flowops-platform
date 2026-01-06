const inventoryRepo = require("../repositories/inventory.repository");

const getInventory = async (req, res) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.max(parseInt(req.query.limit) || 20, 1);
  const skip = (page - 1) * limit;

  console.log("Fetching inventory from MongoDB");

  const [items, total] = await Promise.all([
    inventoryRepo.findAll({ skip, limit }),
    inventoryRepo.countAll(),
  ]);

  res.status(200).json({
    data: items.map((item) => ({
      sku: item.sku,
      availableQty: item.availableQty,
      reservedQty: item.reservedQty,
      updatedAt: item.updatedAt,
    })),
    meta: {
      page,
      limit,
      total,
    },
  });
};

const getInventoryBySku = async (req, res) => {
  const { sku } = req.params;

  const item = await inventoryRepo.findBySku(sku);

  if (!item) {
    return res.status(404).json({ message: "Inventory item not found" });
  }

  res.status(200).json({
    sku: item.sku,
    availableQty: item.availableQty,
    reservedQty: item.reservedQty,
    updatedAt: item.updatedAt,
  });
};

module.exports = {
  getInventory,
  getInventoryBySku,
};
