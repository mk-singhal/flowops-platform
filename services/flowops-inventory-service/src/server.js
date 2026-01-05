require("dotenv").config();

const app = require("./app");

require("./kafka/consumer"); // start kafka consumer

const PORT = process.env.PORT || 4002;

app.listen(PORT, () => {
  console.log(`[Inventory Service] running on port ${PORT}`);
});
