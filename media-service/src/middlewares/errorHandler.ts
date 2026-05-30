import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";
import { ZodError } from "zod";


export const errorHandler = (
    error: any,
    _req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.error(error);

    if(error instanceof ZodError){
        return res.status(400).json({
            success:false,
            errors:error.issues.map(issue => ({
                field: issue.path.join("."),
                message: issue.message
            }))
        });
    }

    res.status(error.status || 500).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "Internal Server Error"
                : error.message,
    });
};