import {Request,Response,NextFunction} from "express";
import { logger } from "../utils/logger.js";
import { AppError } from "../utils/AppError.js";
import { Media } from "../models/Media.js";
import { uploadMediaToCloudinary } from "../utils/cloudinary.js";

export const uploadMedia=async(req:Request,res:Response,next:NextFunction)=>{
    logger.info("Upload Media Endpoint hit..")
    if(!req.file){
            throw new AppError("No File Present", 400);
    }
    const {originalname,mimetype,buffer}=req.file;
    const userId=req.user.userId;
    logger.info(`File details : ${originalname},${mimetype}`);
    logger.info("File Uploading started...")

    const cloudinaryUploadResult=await uploadMediaToCloudinary(req.file);
    logger.info(`File Upload Successful : ${cloudinaryUploadResult.public_id}`);

    const newMedia=await Media.create({
        publicId:cloudinaryUploadResult.public_id,
        originalName:originalname,
        mimeType:mimetype,
        url:cloudinaryUploadResult.secure_url,
        userId
    });
    logger.info(`Media saved to database: ${newMedia._id}`);

    res.status(201).json({
        success:true,
        media:newMedia._id,
        url:newMedia.url,
        message:"File Successfully Uploaded"
    })
}

export const getAllMedia=async(req:Request,res:Response,next:NextFunction)=>{
    const result= await Media.find({userId:req.user.userId});
    res.json(result);
}