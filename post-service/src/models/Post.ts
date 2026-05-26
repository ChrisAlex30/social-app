import mongoose, { InferSchemaType } from "mongoose";

const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    mediaIds: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

postSchema.index({ content: "text" });

postSchema.index({ user: 1, createdAt: -1 });

export type PostType =
  InferSchemaType<typeof postSchema>;

export const Post =
  mongoose.model<PostType>(
    "Post",
    postSchema
  );