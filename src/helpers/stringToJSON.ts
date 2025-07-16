import {z} from "zod";

const stringToJSONSchema = z
  .string()
  .transform((str, ctx): z.infer<ReturnType<typeof z.json>> => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.addIssue({code: "custom", message: "Invalid JSON"});
      return z.NEVER;
    }
  });

export const stringToJSON = () => stringToJSONSchema;
