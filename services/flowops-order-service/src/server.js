require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");
const redis = require("./config/redis");

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();
  await redis.connect();

  app.listen(PORT, () => {
    console.log(`FlowOps Order Service running on port ${PORT}`);
  });
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

process.on("SIGINT", async () => {
  console.log("Shutting down Order Service...");

  try {
    await redis.quit();
    console.log("Redis connection closed");
  } catch (err) {
    console.error("Error closing Redis:", err);
  }

  process.exit(0);
});

module.exports = app;