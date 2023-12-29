import {z} from "zod";

export const userSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    fiscal_code: z.string(),
    email: z.string(),
    phone: z.string(),
    email_verified_at: z.string(),
    status: z.number(),
  })
  .transform((serverUser) => {
    return {
      ...serverUser,
      emailVerifiedAt: serverUser.email_verified_at,
    };
  });
