import multer from "multer";
import {Request,Response,NextFunction} from "express";
import { AppError } from "../utils/AppError.js";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
}).single("file");

export const uploadSingleFile = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    upload(req, res, (error) => {
        if (error instanceof multer.MulterError) {
            return next(new AppError(error.message, 400));
        }

        if (error) {
            return next(new AppError("Unknown File Upload Error", 400));
        }

        if (!req.file) {
            return next(new AppError("No File Present", 400));
        }

        next();
    });
};