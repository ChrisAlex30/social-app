import {Request,Response,NextFunction} from "express";
import { logger } from "../utils/logger.js";
import { postSchema } from "../utils/validation.js";
import { AppError } from "../utils/AppError.js";
import { Post } from "../models/Post.js";

export const createPost=async(req:Request,res:Response,next:NextFunction)=>{
    logger.info("Create Post Endpoint hit..")
    const {content,mediaIds} =postSchema.parse(req.body);

    if(!content){
        logger.warn("Empty Post Content..");
            throw new AppError(
                "Empty Post Content..",
                400
            );
    }
    const newPost = await Post.create({
      user:req.user.userId,
      content,
      mediaIds:mediaIds || []
    });
    logger.warn("Post Created Successfully..");
    res.status(200).json({
        success:true,
        message:"Post Created successfully..",
        newPost
    })    
}