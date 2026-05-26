import {User} from "../models/User.js";
import { logger } from "../utils/logger.js";
import {loginSchema, registerSchema,type IUser} from "../utils/validation.js"
import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import {generateTokens} from "../utils/generateTokens.js"
import { RefreshToken } from "../models/RefreshToken.js";
import crypto from "crypto";



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
    res.status(200).json({
        success:true,
        message:"User registered successfully..",
        accessToken,refreshToken
    })    
}


export const loginUser=async function (req:Request,res:Response,next:NextFunction) {
        logger.info("Login Endpoint hit....")
        const {password,email} =  loginSchema.parse(req.body);
        const user=await User.findOne({email});
        if(!user){
            logger.warn(`Failed login attempt for email: ${email}`);
            throw new AppError(
                "Invalid Credentials",
                400
            );
        }
        const isValidPassword=await user.comparePassword(password);
        if(!isValidPassword){
            logger.warn(`Invalid password for email: ${email}`);
            throw new AppError(
                "Invalid password for email",
                400
            );
        }
        const {accessToken,refreshToken}=await generateTokens(user);
        res.status(200).json({
            success:true,
            message:"User logged in successfully..",
            accessToken,refreshToken,
            userId:user._id
        })
}

export const refreshTokenUser=async function (req:Request,res:Response,next:NextFunction) {
        logger.info("Refresh Token Endpoint hit....")
        const {refreshToken} =  req.body;        
        if(!refreshToken){
            logger.warn("Refresh Token Missing");
            throw new AppError(
                "Refresh Token Missing",
                 400
            );
        }
        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
        const storedToken=await RefreshToken.findOne({token:hashedToken});
        if(!storedToken || storedToken.expiresAt < new Date()){
            logger.warn("Invalid or Expired Refresh Token");
            throw new AppError(
                "Invalid or Expired Refresh Token",
                 400
            );
        }
        const user=await User.findById(storedToken.user)
        if(!user){
            logger.warn("User Not Found");
            throw new AppError(
                "User Not Found",
                 400
            );
        }
        await RefreshToken.deleteOne({_id:storedToken._id});
        const {accessToken:newAccessToken,refreshToken:newRefreshToken} =await generateTokens(user);
        res.status(200).json({
            success:true,
            message:"Refresh Token Generated successfully..",
            accessToken:newAccessToken,
            refreshToken:newRefreshToken
        })
}

export const logoutUser=async function (req:Request,res:Response,next:NextFunction) {
        logger.info("Logout Endpoint hit....")
        const {refreshToken} =  req.body;        
        if(!refreshToken){
            logger.warn("Refresh Token Missing");
            throw new AppError(
                "Refresh Token Missing",
                 400
            );
        }
        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
        await RefreshToken.deleteOne({token:hashedToken});
        logger.info("Refresh Token deleted for logout..")
        res.status(200).json({
            success:true,
            message:"Logged out successfully.."
        }) 
}