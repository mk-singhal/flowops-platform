require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5001;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`FlowOps Order Service running on port ${PORT}`);
  });
};

if (process.env.NODE_ENV !== "test") {
  startServer();
}

module.exports = app;