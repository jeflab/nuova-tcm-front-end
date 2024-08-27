import {z} from "zod";

export const agentSchema = z
  .object({
    id: z.number(),
    name: z.string(),
    surname: z.string(),
    address: z.string(),
    street_number: z.string(),
    city: z.string(),
    zip_code: z.string(),
    region: z.string().nullable(),
    rui_code: z.string(),
    rui_date: z.coerce.date(),
  })
  .transform(({rui_code, rui_date, street_number, zip_code, ...data}) => {
    return {
      ...data,
      ruiCode: rui_code,
      ruiDate: rui_date,
      streetNumber: street_number,
      zipCode: zip_code,
    };
  });
export type Agent = z.infer<typeof agentSchema>;
