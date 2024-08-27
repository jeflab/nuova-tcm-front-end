import {z} from "zod";

export const userSchema = z
  .object({
    id: z.number(),
    fiscal_code: z.string(),
    email: z.string(),
    phone: z.string().nullable(),
  })
  .transform(({fiscal_code, ...data}) => ({
    ...data,
    fiscalCode: fiscal_code,
  }));
export type User = z.infer<typeof userSchema>;
