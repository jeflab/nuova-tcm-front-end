"use server";

import {
  buildQuotePayload,
  getQuoteResponseSchema,
  type GetQuoteParams,
} from "@/app/(menu)/(authenticated)/quoter/buildQuotePayload";
import {post} from "@/services/api";

export async function getPublicQuote(quoterData: GetQuoteParams) {
  return await post("/public-quoter", {
    payloadShape: getQuoteResponseSchema,
    data: buildQuotePayload(quoterData),
    headers: {"X-Internal-Secret": process.env.INTERNAL_API_SECRET ?? ""},
  });
}
