import express, { Router } from "express";
import {createPost} from "../controllers/post-controller.js"
import { authRequest } from "../middlewares/auth.js";

export const postRouter=express.Router();
postRouter.use(authRequest);

postRouter.post("/create-post",createPost);
