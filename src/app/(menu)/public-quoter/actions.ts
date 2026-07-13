"use server";

import {
  buildQuotePayload,
  getQuoteResponseSchema,
  type GetQuoteParams,
} from "@/app/(menu)/(authenticated)/quoter/buildQuotePayload";
import {getClientIp} from "@/helpers/getClientIp";
import {post} from "@/services/api";

export async function getPublicQuote(quoterData: GetQuoteParams) {
  const clientIp = await getClientIp();

  return await post("/public-quoter", {
    payloadShape: getQuoteResponseSchema,
    data: buildQuotePayload(quoterData),
    headers: {
      "X-Internal-Secret": process.env.INTERNAL_API_SECRET ?? "",
      ...(clientIp ? {"X-Forwarded-Client-Ip": clientIp} : {}),
    },
  });
}
