import {z} from "zod";

export const serverErrorSchema = z.object({
  status: z.literal("failed"),
  message: z.string(),
  code: z.number().optional(),
});

export function isServerError(
  json: unknown,
): json is z.infer<typeof serverErrorSchema> {
  return (
    "status" in (json as z.infer<typeof serverErrorSchema>) &&
    "message" in (json as z.infer<typeof serverErrorSchema>) &&
    (json as z.infer<typeof serverErrorSchema>).status === "failed"
  );
}
