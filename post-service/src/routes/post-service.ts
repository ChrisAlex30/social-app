import express, { Router } from "express";
import {createPost,delPost,getAllPosts, getPost} from "../controllers/post-controller.js"
import { authRequest } from "../middlewares/auth.js";

export const postRouter=express.Router();
postRouter.use(authRequest);

postRouter.post("/create-post",createPost);
postRouter.get("/all-posts",getAllPosts);
postRouter.get("/:id",getPost);
postRouter.delete("/:id",delPost);
