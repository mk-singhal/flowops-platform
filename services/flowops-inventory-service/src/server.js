require("dotenv").config();

const app = require("./app");
const connectMongo = require("./config/mongo");

const { startConsumer } = require("./kafka/consumer"); // start kafka consumer

const PORT = process.env.PORT || 4002;

startConsumer();

const start = async () => {
  await connectMongo();

  app.listen(PORT, () => {
    console.log(`[Inventory Service] running on port ${PORT}`);
  });
};

start();