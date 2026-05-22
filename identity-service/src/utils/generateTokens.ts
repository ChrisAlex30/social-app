import jwt from "jsonwebtoken";
import crypto from "crypto";
import { UserType } from "../models/User.js";
import { HydratedDocument } from "mongoose";
import { RefreshToken } from "../models/RefreshToken.js";

export type UserDocument = HydratedDocument<UserType>;

export const generateTokens=async (user:UserDocument)=>{
    const accessToken=jwt.sign({
        userId:user._id,
        username:user.username
    },process.env.JWT_SECRET!,{expiresIn:'60m'})

    const refreshToken = crypto.randomBytes(64).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");

    const expiresAt=new Date();
    expiresAt.setDate(expiresAt.getDate()+7)

    await RefreshToken.create({
        token:hashedToken,
        user:user._id,
        expiresAt
    })

    return {accessToken,refreshToken}

}

