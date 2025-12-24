const express = require("express");
const router = express.Router();

const {
    getOrders,
    createOrder,
    updateOrder,
    cancelOrder   
} = require("../controllers/order.controller");

router.get("/", getOrders);
router.post("/", createOrder);
router.put("/:id", updateOrder);
router.delete("/:id", cancelOrder);

module.exports = router;