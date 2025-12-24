const Joi = require("joi");

const itemSchema = Joi.object({
  sku: Joi.string().required(),
  qty: Joi.number().integer().min(1).required(),
  price: Joi.number().min(0).required(),
});

const createOrderSchema = Joi.object({
  customer: Joi.string().trim().min(2).required(),
  address: Joi.string().trim().min(5).required(),
  items: Joi.array().items(itemSchema).min(1).required(),
  status: Joi.string().valid("Pending", "Completed", "Cancelled").optional(),
});

const updateOrderSchema = Joi.object({
  customer: Joi.string().trim().min(2).optional(),
  address: Joi.string().trim().min(5).optional(),
  items: Joi.array().items(itemSchema).min(1).optional(),
  status: Joi.string().valid("Pending", "Completed", "Cancelled").optional(),
}).min(1); // must update at least one field

module.exports = {
  createOrderSchema,
  updateOrderSchema,
};
