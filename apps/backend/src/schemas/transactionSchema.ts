



import { z } from "zod";

export const transactionSchema = z.object({
  amount: z.number().int().positive(),
  recipientId: z.number().int().positive(),
});