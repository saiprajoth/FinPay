import { email, z } from "zod";

const verifySchema = z.object({
  
  email: z
    .email()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "kindly enter a valid email",
    ),
  otp:z.string().length(6,{ message: "otp must be exactly 6 characters" })
});

export default verifySchema;
