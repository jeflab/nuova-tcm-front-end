import {z} from "zod";

export const agentSchema = z.object({
  id: z.number(),
  name: z.string(),
  surname: z.string(),
});
