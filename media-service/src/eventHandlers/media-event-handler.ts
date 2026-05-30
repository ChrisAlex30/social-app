import { Media } from "../models/Media.js";
import { deleteMediaFromCloudinary } from "../utils/cloudinary.js";
import { logger } from "../utils/logger.js";

interface PostDeletedEvent {
    postId: string;
    userId: string;
    mediaIds: string[];
}

export const handlePostDeleted = async (event: PostDeletedEvent) => {
    const { mediaIds } = event;
    if (!mediaIds.length) {
        return;
    }
    const mediaToDelete = await Media.find({
        _id: { $in: mediaIds }
    });
    await Promise.allSettled(
        mediaToDelete.map(media =>
            deleteMediaFromCloudinary(
                media.publicId
            )
        )
    );
    await Media.deleteMany({
        _id: { $in: mediaIds }
    });
    logger.info(
        `Deleted ${mediaIds.length} media files`
    );
};