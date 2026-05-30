import { z } from "zod";

export const postSchema = z.object({
  content: z.string().min(3).max(500),
  mediaIds: z.array(z.string()).optional(),
});

export type IPost = z.infer<typeof postSchema>;

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().default(10),
});


