const Redis = require("ioredis");

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  
  lazyConnect: true,        // start only when needed
  connectTimeout: 500,      // fail fast
  maxRetriesPerRequest: 1,  // no hanging requests
  retryStrategy: () => null // stop infinite retries
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis error:", err);
});

module.exports = redis;
