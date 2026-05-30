import mongoose, { InferSchemaType } from "mongoose";

const mediaSchema=new mongoose.Schema({
    publicId:{
        type:String,
        required:true,
    },
    originalName:{
        type:String,
        required:true,
    },
    mimeType:{
        type:String,
        required:true,
    },
    url:{
        type:String,
        required:true,
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    }
},{timestamps:true})

export type MediaType =
  InferSchemaType<typeof mediaSchema>;

export const Media =
  mongoose.model<MediaType>(
    "Media",
    mediaSchema
  );