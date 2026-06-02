import { v2 as cloudinary, UploadApiResponse, } from "cloudinary";
import { logger } from "./logger.js";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMediaToCloudinary = (
    file: Express.Multer.File
): Promise<UploadApiResponse> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "auto" },
            (error, result) => {
                if (error) {
                    logger.error("Cloudinary upload failed", error);
                    return reject(error);
                }

                if (!result) {
                    return reject(new Error("Cloudinary returned no result"));
                }

                resolve(result);
            }
        );
        uploadStream.end(file.buffer);
    });
};

export interface DeleteApiResponse {
  result: "ok" | "not found";
}

export const deleteMediaFromCloudinary = async (
  publicId: string
): Promise<DeleteApiResponse> => {
  return cloudinary.uploader.destroy(publicId);
};

