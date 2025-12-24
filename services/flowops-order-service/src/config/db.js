const mongoose = require("mongoose");

const connectDB = async () => {
  const isTest = process.env.NODE_ENV === "test";

  const mongoUri = isTest
    ? process.env.MONGO_URI_TEST
    : process.env.MONGO_URI;

  try {
    await mongoose.connect(mongoUri, {
      autoIndex: true,
    });
    console.log(`MongoDB connected (${isTest ? "test" : "dev"})`);
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
