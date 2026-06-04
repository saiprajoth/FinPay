import { z } from "zod";

const userSchema = z.object({
  name: z.string(),
  email: z
    .email()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "kindly enter a valid email",
    ),
  password: z.string(),
});

export default userSchema
