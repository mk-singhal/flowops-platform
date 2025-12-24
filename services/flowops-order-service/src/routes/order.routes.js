const express = require("express");
const router = express.Router();

const {
    getOrders,
    createOrder,
    updateOrder,
    cancelOrder   
} = require("../controllers/order.controller");

const validate = require("../middleware/validate.middleware");
const {
  createOrderSchema,
  updateOrderSchema,
} = require("../validators/order.validator");

router.get("/", getOrders);
router.post("/", validate(createOrderSchema), createOrder);
router.put("/:id", validate(updateOrderSchema), updateOrder);
router.delete("/:id", cancelOrder);

module.exports = router;