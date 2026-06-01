import {Request,Response,NextFunction} from "express";
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/AppError.js";


export const authRequest=async(req:Request,res:Response,next:NextFunction)=>{
    const userId=req.headers["x-user-id"];
    if(!userId || typeof userId !== "string"){
        logger.warn("Access attempt without UserId");
        throw new AppError(
                "Authentication required.Please login..",
                400
            );
    }
    req.user={userId};
    next()
}
