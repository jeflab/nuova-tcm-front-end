import {z} from "zod";

export const userSchema = z
  .object({
    id: z.number(),
    fiscal_code: z.string(),
    email: z.string(),
    phone: z.string(),
    email_verified_at: z.string(),
  })
  .transform(({email_verified_at, fiscal_code, ...data}) => ({
    ...data,
    fiscalCode: fiscal_code,
    isEmailVerified: email_verified_at !== null,
  }));
export type User = z.infer<typeof userSchema>;
