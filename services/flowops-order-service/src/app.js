const express = require("express");
const cors = require("cors");

const app = express();
const orderRoutes = require("./routes/order.routes"); 
const errorHandler = require("./middleware/error.middleware"); 

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
    res.json({ status: "ok", service: "order-service" });
});

// order routes
app.use("/orders", orderRoutes);

app.use(errorHandler);

module.exports = app;