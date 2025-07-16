import z, {ZodRawShape} from "zod";

function createServerSuccessSchema<ResponsePayloadShape extends ZodRawShape>(
  successDataShape: ResponsePayloadShape,
) {
  return z.object({
    ...successDataShape,
    status: z.literal("success"),
    responseStatus: z.number(),
  });
}

const serverErrorSchema = z.object({
  status: z.literal("failed"),
  message: z.string(),
  responseStatus: z.number(),
  code: z.number().optional(),
  exception: z.string().optional(),
  file: z.string().optional(),
  line: z.number().optional(),
  trace: z.array(z.any()).optional(),
});

async function apiCall<ResponsePayloadShape extends ZodRawShape>(
  url: string,
  payloadShape: ResponsePayloadShape,
) {
  const serverSuccessSchema = createServerSuccessSchema(payloadShape);
  const serverSchema = z.discriminatedUnion("status", [
    serverSuccessSchema,
    serverErrorSchema,
  ]);

  const response = await fetch(url, {});
  const responseJson = await response.json();

  let serverResponseJson: z.infer<typeof serverSchema>;
  try {
    serverResponseJson = serverSchema.parse(responseJson);
  } catch (e) {
    //handle parsing error
  }

  if (serverResponseJson.status === "success") {
  }
}
