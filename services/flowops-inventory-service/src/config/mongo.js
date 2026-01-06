const mongoose = require("mongoose");

mongoose.set("bufferCommands", false);
mongoose.set("bufferTimeoutMS", 0);

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME,
      serverSelectionTimeoutMS: 5000,
    });

    console.log("[Inventory Service] MongoDB connected");
  } catch (err) {
    console.error(
      "[Inventory Service] MongoDB connection failed, retrying in 5s",
      err.message
    );
    setTimeout(connectMongo, 5000);
  }
};

module.exports = connectMongo;
