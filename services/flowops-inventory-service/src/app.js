const express = require("express");
const cors = require("cors");

const app = express();
const inventoryRoutes = require("./routes/inventory.routes");

app.use(cors());

app.use(express.json());

app.use("/inventory", inventoryRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "inventory-service" });
});

module.exports = app;
