import {z} from "zod";

export const LIP_STATES = [
  "Aperta",
  "In attesa di pagamento",
  "Completata",
] as const;

export const lipSchema = z.object({
  id: z.number(),
  surname: z.string(),
  name: z.string(),
  date: z.coerce.date(),
  state: z.enum(LIP_STATES),
});

export type Lip = z.infer<typeof lipSchema>;
