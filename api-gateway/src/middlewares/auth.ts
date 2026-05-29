import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/AppError.js";
import jwt from "jsonwebtoken";

interface JwtUserPayload {
  userId: string;
  username?: string;
}
export const validateToken=async function (req:Request,res:Response,next:NextFunction) {
    const authHeader=req.headers.authorization
    const token=authHeader && authHeader.split(" ")[1];
    if(!token){
        logger.warn("Access Attempt without valid token");
        throw new AppError(
            "Authentication required",
            401
        );
    }
    const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
    ) as JwtUserPayload;

    req.user = decoded;

    next();
    
}