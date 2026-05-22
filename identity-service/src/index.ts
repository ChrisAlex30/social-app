import express from "express";
import helmet from "helmet";
import cors from "cors";

import {logger} from "./utils/logger.js";
import connectDB from "./utils/db.js";
import { Request, Response, NextFunction } from "express";
import { globalLimiter } from "./middlewares/rate-limiter.js";
import { identityRouter } from "./routes/identity-service.js";
import { errorHandler } from "./middlewares/errorHandler.js";


const app=express();

await connectDB() ;

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

app.use('/api/auth/',identityRouter);

app.use(errorHandler);

const PORT=process.env.PORT || 3001

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

app.listen(PORT,()=>logger.info(`Identity App started on port ${PORT}`));

