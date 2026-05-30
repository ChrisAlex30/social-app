import express from "express";
import {loginUser, logoutUser, refreshTokenUser, registerUser} from "../controllers/identity-controller.js"
import { loginLimiter } from "../middlewares/rate-limiter.js";

export const identityRouter=express.Router();
identityRouter.post(
  "/register",
  (req, res, next) => {
    console.log("REGISTER ROUTE HIT");
    next();
  },
  registerUser
);
identityRouter.post("/login",loginUser);
identityRouter.post("/refresh-token",refreshTokenUser);
identityRouter.post("/logout",logoutUser);

