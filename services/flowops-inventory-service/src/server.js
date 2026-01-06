require("dotenv").config();

const app = require("./app");
const connectMongo = require("./config/mongo");

require("./kafka/consumer"); // start kafka consumer

const PORT = process.env.PORT || 4002;

const start = async () => {
  await connectMongo();

  app.listen(PORT, () => {
    console.log(`[Inventory Service] running on port ${PORT}`);
  });
};

start();