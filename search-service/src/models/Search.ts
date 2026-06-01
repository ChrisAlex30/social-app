import mongoose, { InferSchemaType } from "mongoose";

const searchSchema=new mongoose.Schema({
    postId:{
        type:String,
        required:true,
        unique:true
    },
    userId:{
        type:String,
        required:true,
        index:true
    },
    content:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        required:true
    }
},{timestamps:true})

searchSchema.index({content:"text"});
searchSchema.index({createdAt:-1});

export type SearchType =
  InferSchemaType<typeof searchSchema>;
export const Search=mongoose.model<SearchType>("Search",searchSchema);

