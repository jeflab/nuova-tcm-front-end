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
    typeof json === "object" &&
    json !== null &&
    "status" in json &&
    (json as Record<string, unknown>).status !== "success"
  );
}

export const createServerSuccessSchema = <
  ResponsePayloadShape extends ZodRawShape,
>(
  successDataShape: ResponsePayloadShape,
) =>
  z.object({
    ...successDataShape,
    status: z.literal("success"),
    responseStatus: z.number(),
  });

export function invalidateTag(tag: Tag) {
  revalidateTag(tag);
}
