import express from "express";
import {registerUser} from "../controllers/identity-controller.js"
import { loginLimiter } from "../middlewares/rate-limiter.js";

export const identityRouter=express.Router();
identityRouter.post("/register",loginLimiter,registerUser);
