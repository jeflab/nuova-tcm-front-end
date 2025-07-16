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
    return {status: "failed"} as z.infer<typeof serverErrorSchema>;
  }

  // ❌ TS2339 here:
  if (serverResponseJson.status !== "success") {
    // log error and common error handling
  }

  return serverResponseJson;
}

const profile = await apiCall("/api/profile", {
  name: z.string(),
  email: z.string().email(),
  permissions: z.array(z.string()),
});

if (profile.status === "success") {
  console.log("Profile data:", profile);
  // Here profile is correctly typed as:
  // const profile: {
  //   name: string
  //   email: string
  //   permissions: string[]
  //   status: "success"
  //   responseStatus: number
  // }
}

// Soluzione possibile: creare un type guard da usare nella funzione apiCall che controlli l'esistenza di "status"
//  Funziona ma aspettiamo una risposta su github prima di implementarla
function isErrorResponse(
  response: unknown,
): response is z.infer<typeof serverErrorSchema> {
  return (
    typeof response === "object" &&
    response !== null &&
    "status" in response &&
    (response as Record<string, unknown>).status === "failed"
  );
}
