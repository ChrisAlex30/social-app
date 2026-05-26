import { RateLimiterRedis } from "rate-limiter-flexible";
import type { Request, Response, NextFunction } from "express";
import { redisClient } from "../utils/redis-client.js";

const createRateLimiter = (
  keyPrefix: string,
  points: number,
  duration: number,
  message: string
) => {
  const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix,
    points,
    duration,
  });

  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      await limiter.consume(req.ip || "unknown");

      next();
    } catch {
      return res.status(429).json({
        success: false,
        message,
      });
    }
  };
};

export const globalLimiter = createRateLimiter(
  "global",
  10,
  1,
  "Too many requests. Try again later."
);
