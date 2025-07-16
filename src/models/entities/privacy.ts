import {stringToJSON} from "@/helpers/stringToJSON";
import {z} from "zod";

const privacyDataSchema = z.array(
  z.object({
    text: z.string(),
    questions: z.array(
      z.object({
        name: z.string(),
        text: z.string(),
        required: z.boolean().optional(),
      }),
    ),
  }),
);

export const privacySchema = z
  .object({
    version: z.coerce.number(),
    date: z.coerce.date(),
    description: z.string(),
    json_data: stringToJSON().pipe(privacyDataSchema),
  })
  .transform(({json_data, ...data}) => {
    return {
      ...data,
      data: json_data,
    };
  });
export type Privacy = z.infer<typeof privacySchema>;
