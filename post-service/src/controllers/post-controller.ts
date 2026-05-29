import {Request,Response,NextFunction} from "express";
import { logger } from "../utils/logger.js";
import { paginationSchema, postSchema } from "../utils/validation.js";
import { AppError } from "../utils/AppError.js";
import { Post } from "../models/Post.js";

async function invalidatePostCache(req: Request,postId: string) {
    const userId = req.user.userId;
    await req.redisClient.del(
        `post:${userId}:${postId}`
    );
    const keys = await req.redisClient.keys(
        `posts:${userId}:*`
    );
    if (keys.length > 0) {
        await req.redisClient.del(...keys);
    }
}

export const createPost=async(req:Request,res:Response,next:NextFunction)=>{
    logger.info("Create Post Endpoint hit..")
    const {content,mediaIds} =postSchema.parse(req.body);
    const newPost = await Post.create({
      user:req.user.userId,
      content,
      mediaIds:mediaIds || []
    });
    await invalidatePostCache(req,newPost._id.toString());
    logger.info("Post Created Successfully..");
    res.status(201).json({
        success:true,
        message:"Post Created successfully..",
        newPost
    })    
}

export const getAllPosts=async(req:Request,res:Response,next:NextFunction)=>{
    logger.info("Get All Posts Endpoint hit..");
    const userId=req.user.userId;
    const { page, limit } = paginationSchema.parse(req.query);
    const startIndex=(page-1)*limit;

    const cacheKey= `posts:${userId}:${page}:${limit}`;
    const cachedPosts=await req.redisClient.get(cacheKey);
    if(cachedPosts){
        return res.json(JSON.parse(cachedPosts));
    }
    const posts=await Post.find({user:userId}).sort({createdAt:-1}).skip(startIndex).limit(limit);
    const totalPosts=await Post.countDocuments({user:userId});
    const result={
        posts,
        currentPage:page,
        totalPages:Math.ceil(totalPosts/limit),
        totalPosts
    };
    await req.redisClient.setex(cacheKey,300,JSON.stringify(result));
    res.json(result);
}

export const getPost=async(req:Request,res:Response,next:NextFunction)=>{
    logger.info("Get Post Endpoint hit..");
    const userId=req.user.userId;
    const postId=req.params.id;
    const cacheKey=`post:${userId}:${postId}`;
    const cachedPost=await req.redisClient.get(cacheKey);
    if(cachedPost){
        return res.json(JSON.parse(cachedPost));
    }
    const post=await Post.findOne({
        _id:postId,
        user:userId
    });
    if(!post){        
            throw new AppError(
                "Post Not Found..",
                404
            );
    }
    await req.redisClient.setex(cacheKey,300,JSON.stringify(post));
    res.json(post);
}

export const delPost=async(req:Request,res:Response,next:NextFunction)=>{
    logger.info("Delete Post Endpoint hit..");

    const post=await Post.findOneAndDelete({
        _id:req.params.id,
        user:req.user.userId
    })
    if(!post){        
            throw new AppError(
                "Post Not Found..",
                404
            );
    }
    await invalidatePostCache(req,req.params.id.toString());
    res.json({
        success:true,
        message:"Post deleted successsfully"
    })
}