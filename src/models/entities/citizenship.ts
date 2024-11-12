import {z} from "zod";

export const citizenshipSchema = z.object({
  alpha2: z.string(),
  citizenship: z.string(),
});
