import mongoose, { InferSchemaType } from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

refreshTokenSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

export type RefreshTokenType =
  InferSchemaType<typeof refreshTokenSchema>;

export const RefreshToken =
  mongoose.model<RefreshTokenType>(
    "RefreshToken",
    refreshTokenSchema
  );