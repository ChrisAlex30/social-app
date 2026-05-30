import {Redis} from "ioredis";
import { logger } from "./logger.js";

export const redisClient = new Redis(process.env.REDIS_URL!);

redisClient.on("ready", () => {
  logger.info("Redis connected");
});

redisClient.on("error", (err) => {
  logger.error(err);
});