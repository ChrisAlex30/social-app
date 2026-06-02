import express from "express";
import helmet from "helmet";
import cors from "cors";

import {logger} from "./utils/logger.js";
import connectDB from "./utils/db.js";
import { Request, Response, NextFunction } from "express";
import { globalLimiter } from "./middlewares/rate-limiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { connectRabbitMQ, consumeEvent } from "./utils/rabbitmq.js";
import { handlePostCreated,handlePostDeleted } from "./eventHandlers/search-event-handler.js";
import { searchRouter } from "./routes/search-service.js";
import { redisClient } from "./utils/redis-client.js";


const app=express();


app.use(helmet())
app.use(cors())
app.use(express.json())

app.use((req: Request,res: Response,next: NextFunction) => {
        logger.info({
            method: req.method,
            url: req.url,
            body: req.body,
        });
        next()
})

app.set("trust proxy", 1);

app.use(globalLimiter);

app.use('/api/search',(req: Request,res: Response,next: NextFunction) => {
    req.redisClient=redisClient;
    next()
},searchRouter);

app.use(errorHandler);

const PORT=process.env.PORT || 3004

process.on("uncaughtException", (error) => {
  logger.error(error);

  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error(
    `Unhandled rejection at: ${promise}, reason: ${reason}`
  );

  process.exit(1);
});

const start = async () => {
  try {
    await connectDB();
    await connectRabbitMQ();
    await consumeEvent("post.created",handlePostCreated);
    await consumeEvent("post.delete",handlePostDeleted);

    app.listen(PORT, () => {
      logger.info(`Search App started on port ${PORT}`);
    });
  } catch (error) {
    logger.error(error);
    logger.info("Startup failed. Retrying in 5 seconds...");
    setTimeout(start, 5000);
  }
};

start();
