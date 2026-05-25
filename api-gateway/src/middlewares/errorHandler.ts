import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";


export const errorHandler = (
    error: any,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(error);

    res.status(error.status || 500).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "Internal Server Error"
                : error.message,
    });
};