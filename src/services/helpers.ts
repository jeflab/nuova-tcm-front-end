import {revalidateTag} from "next/cache";
import {z, ZodRawShape} from "zod";
import {Tag} from "./const";

export const serverErrorSchema = z.object({
  status: z.literal("failed"),
  message: z.string(),
  responseStatus: z.number(),
  code: z.number().optional(),
  exception: z.string().optional(),
  file: z.string().optional(),
  line: z.number().optional(),
  trace: z.array(z.any()).optional(),
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

export const createServerSuccessSchema = <
  ResponsePayloadShape extends ZodRawShape,
>(
  successDataShape: ResponsePayloadShape,
) =>
  z.object({
    status: z.literal("success"),
    responseStatus: z.number(),
    ...successDataShape,
  });

export function invalidateTag(tag: Tag) {
  revalidateTag(tag);
}
