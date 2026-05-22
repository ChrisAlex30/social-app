import {User} from "../models/User.js";
import { logger } from "../utils/logger.js";
import {registerSchema,type IUser} from "../utils/validation.js"
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import {generateTokens} from "../utils/generateTokens.js"

export const registerUser=async function (req:Request,res:Response,next:NextFunction) {
    logger.info("Registration Endpoint hit....")

    const {email,password,username} =  registerSchema.parse(req.body);

    let user=await User.findOne({
        $or:[{email},{username}]
    });

    if(user){
        throw new AppError(
            "User already exists",
            409
        );
    }

    const newUser = await User.create({
      email,
      username,
      password,
    });

    logger.warn("User Created Successfully..",newUser._id);

    const {accessToken,refreshToken}=await generateTokens(newUser);

    res.status(201).json({
        success:true,
        message:"User registered successfully..",
        accessToken,refreshToken
    })    
}