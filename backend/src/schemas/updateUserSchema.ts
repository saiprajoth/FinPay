import { z } from "zod";

export const updateUserSchema = z
  .object({
    firstname: z.string().min(1).optional(),
    lastname: z.string().min(1).optional(),
    password: z.string().min(6).optional(),
  })
  .refine((data) => data.firstname || data.lastname || data.password, {
    message: "At least one field must be provided",
  });
