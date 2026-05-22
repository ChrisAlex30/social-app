import mongoose, { InferSchemaType } from "mongoose";
import argon2 from "argon2";
import { IUser, IUserMethods } from "../utils/validation.js";

const userSchema = new mongoose.Schema<IUser,{},IUserMethods>({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true
    },
    password:{
        type:String,
        required:true
    }
}, 
{
    timestamps:true
});

userSchema.pre("save", async function () {
  if (this.isModified("password")){
      this.password = await argon2.hash(this.password);
  }
});

userSchema.methods.comparePassword=async function(password:string) {
    return argon2.verify(this.password,password)    
}

export type UserType = InferSchemaType<typeof userSchema>;
export const User = mongoose.model<IUser, mongoose.Model<IUser, {}, IUserMethods>>(
  "User",
  userSchema
);

