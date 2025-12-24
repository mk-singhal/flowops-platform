const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
    },
    items: [
      {
        sku: { type: String, required: true },
        qty: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-validate hook
 */
OrderSchema.pre("validate", function () {
  if (this.items && this.items.length) {
    this.totalAmount = this.items.reduce(
      (sum, item) => sum + item.qty * item.price,
      0
    );
  }
});

module.exports = mongoose.model("Order", OrderSchema);