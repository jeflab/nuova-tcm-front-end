import {normalizeError} from "@/helpers/errors";
import {z} from "zod";

const stringToJSONSchema = z
  .string()
  .transform((str, ctx): z.infer<ReturnType<typeof z.json>> => {
    try {
      return JSON.parse(str);
    } catch (e) {
      ctx.issues.push({
        code: "custom",
        message: "Invalid JSON: " + normalizeError(e).message,
        input: ctx.value,
      });
      return z.NEVER;
    }
  });

export const stringToJSON = () => stringToJSONSchema;
