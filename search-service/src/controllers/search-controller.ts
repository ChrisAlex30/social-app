import {Request,Response,NextFunction} from "express";
import { logger } from "../utils/logger.js";
import { Search } from "../models/Search.js";

export const searchPost=async(req:Request,res:Response,next:NextFunction)=>{
    logger.info("Search Post Endpoint hit..");
    const {query}=req.body;
    const result=await Search.find(
        {$text:{$search:query}},
        {score:{$meta:"textScore"}})
        .sort({score:{$meta:"textScore"}})
        .limit(10);
    res.json(result);
}
