"use server";

import {post} from "@/services/api";
import {
  buildQuotePayload,
  getQuoteResponseSchema,
  type GetQuoteParams,
} from "./buildQuotePayload";

export async function getQuote(quoterData: GetQuoteParams) {
  return await post("/quoter", {
    payloadShape: getQuoteResponseSchema,
    data: buildQuotePayload(quoterData),
  });
}
