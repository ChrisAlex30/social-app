import express, { Router } from "express";
import {searchPost} from "../controllers/search-controller.js"
import { authRequest } from "../middlewares/auth.js";

export const searchRouter=express.Router();
searchRouter.use(authRequest);

searchRouter.get("/search-post",searchPost);
