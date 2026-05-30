import express from "express";
import {uploadMedia} from "../controllers/media-controller.js"
import { authRequest } from "../middlewares/auth.js";
import { uploadSingleFile } from "../middlewares/multerErrorHandler.js";

export const mediaRouter=express.Router();

mediaRouter.post("/upload",authRequest,uploadSingleFile,uploadMedia);
