"use server";

import {
  buildQuotePayload,
  getQuoteResponseSchema,
  type GetQuoteParams,
} from "@/app/(menu)/(authenticated)/quoter/buildQuotePayload";
import {getClientIp} from "@/helpers/getClientIp";
import {getClientUserAgent} from "@/helpers/getClientUserAgent";
import {post} from "@/services/api";

export async function getPublicQuote(
  quoterData: GetQuoteParams,
  turnstileToken = "",
) {
  const clientIp = await getClientIp();
  const clientUserAgent = await getClientUserAgent();

  return await post("/public-quoter", {
    payloadShape: getQuoteResponseSchema,
    data: buildQuotePayload(quoterData),
    headers: {
      "X-Internal-Secret": process.env.INTERNAL_API_SECRET ?? "",
      ...(clientIp ? {"X-Forwarded-Client-Ip": clientIp} : {}),
      ...(clientUserAgent ? {"X-Forwarded-Client-Ua": clientUserAgent} : {}),
      ...(turnstileToken ? {"X-Turnstile-Token": turnstileToken} : {}),
    },
  });
}
