import { createClient } from "redis";
console.log(process.env.REDIS_URL);
const redis = createClient({
  username: "default",
  password: "IUGoUKGjJFPJmHtLWxJ6Hry2YWbrlsw1",
  socket: {
    host: "redis-17101.c212.ap-south-1-1.ec2.redns.redis-cloud.com",
    port: 17101,
  },
});

redis.on("error", (err) => console.error("❌ Redis Client Error", err));

await redis.connect();
console.log("🔗 Connected to Redis");

export default redis;
