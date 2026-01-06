const express = require("express");
const router = express.Router();

const {
  getInventory,
  getInventoryBySku,
} = require("../controllers/inventory.controller");

router.get("/", getInventory);
router.get("/:sku", getInventoryBySku);

module.exports = router;
