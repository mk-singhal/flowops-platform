const redis = require("../config/redis");

const invalidateOrdersCache = async () => {
  const keys = await redis.keys("orders:page:*");

  if (keys.length > 0) {
    await redis.del(keys);
    console.log(`Invalidated ${keys.length} orders cache keys`);
  }
};

module.exports = {
  invalidateOrdersCache,
};
