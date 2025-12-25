const redis = require("../config/redis");

const acquireLock = async (key, ttl = 10) => {
  const result = await redis.set(
    key,
    "locked",
    "NX",
    "EX",
    ttl
  );

  return result === "OK";
};

const releaseLock = async (key) => {
  await redis.del(key);
};

module.exports = {
  acquireLock,
  releaseLock,
};
