import { Search } from "../models/Search.js";
import { logger } from "../utils/logger.js";

interface PostCreatedEvent {
    postId: string;
    userId: string;
    content:string
    createdAt: Date;
}

export const handlePostCreated = async (event: PostCreatedEvent) => {
        const {postId,userId,content,createdAt}=event;
        const newSearchPost=await Search.create({
            postId,userId,content,createdAt
        })
        logger.info(`Serach post created for post id : ${postId}`)
}

interface PostDeletedEvent {
    postId: string;
    userId: string;
    mediaIds: string[];
}

export const handlePostDeleted = async (event: PostDeletedEvent) => {
    const {postId}=event;
    await Search.findOneAndDelete({postId})
    logger.info(`Serach post deleted for post id : ${postId}`)
};
