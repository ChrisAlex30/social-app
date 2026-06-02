import express from "express";
import helmet from "helmet";
import cors from "cors";

import {logger} from "./utils/logger.js";
import { Request, Response, NextFunction } from "express";
import { globalLimiter } from "./middlewares/rate-limiter.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { createProxy } from "./middlewares/auth-proxy.js";
import { validateToken } from "./middlewares/auth.js";


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
app.use(
  "/v1/auth",
  createProxy(
    process.env.IDENTITY_SERVICE_URL!,
    "Identity Service"
  )
);

app.use(
  "/v1/posts",
  validateToken,
  createProxy(
    process.env.POST_SERVICE_URL!,
    "Post Service",
    true
  )
);

app.use(
  "/v1/media",
  validateToken,
  createProxy(
    process.env.MEDIA_SERVICE_URL!,
    "Media Service",
    true,
    false
  )
);

app.use(
  "/v1/search",
  validateToken,
  createProxy(
    process.env.SEARCH_SERVICE_URL!,
    "Search Service",
    true
  )
);

app.use(errorHandler);

const PORT=process.env.PORT || 3000

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

app.listen(PORT,()=>{
    logger.info(`API GATEWAY SERVICE started on port ${PORT}`)
    logger.info(`Identity SERVICE started on url ${process.env.IDENTITY_SERVICE_URL}`)
    logger.info(`Post SERVICE started on url ${process.env.POST_SERVICE_URL}`)
    logger.info(`Media SERVICE started on url ${process.env.MEDIA_SERVICE_URL}`)
    logger.info(`Search SERVICE started on url ${process.env.SEARCH_SERVICE_URL}`)
    logger.info(`REDIS SERVICE started on url ${process.env.REDIS_URL}`)
});

