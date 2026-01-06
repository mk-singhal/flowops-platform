const mongoose = require("mongoose");

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "flowops-inventory",
    });

    console.log("[Inventory Service] MongoDB connected");
  } catch (err) {
    console.error("[Inventory Service] MongoDB connection failed", err);
    process.exit(1);
  }
};

module.exports = connectMongo;
