import { z } from "zod";

export const AuthSchema = z.object({
  email: z.string().min(3, "email is too short"),
  password: z.string().min(3, "password is too short"),
})