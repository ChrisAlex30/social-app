import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.email(),
  password: z.string().min(6),
});

export type IUser = z.infer<typeof registerSchema>;

export interface IUserMethods {
  comparePassword(password: string): Promise<boolean>;
}

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});

export type IUserLogin = z.infer<typeof loginSchema>;