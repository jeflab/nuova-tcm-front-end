"use server";

import {getCoverageDuration} from "@/app/(menu)/(authenticated)/quoter/helpers";
import {calendarYearAge} from "@/helpers/ages";
import {post} from "@/services/api";
import {z} from "zod";

const getQuoteResponseSchema = {
  quotazione: z.object({
    premium: z.number(),
    originalPremium: z.number(),
  }),
};
interface GetQuoteParams {
  accidentalDeath: boolean;
  birthDate: string;
  cancer: {enabled: boolean; coverage: string};
  death: string;
  exemptionFromPaying: boolean;
  tpd: {enabled: boolean; coverage: string};
  tpi: {enabled: boolean; coverage: string};
  smoker: string;
  trafficAccidentalDeath: boolean;
}
export async function getQuote(quoterData: GetQuoteParams) {
  const monthInFourYears = 48;
  const data = {
    sumInsured: parseInt(quoterData.death),
    age: calendarYearAge(quoterData.birthDate),
    duration: getCoverageDuration(quoterData.birthDate),
    sumInsuredForTotalPermanentDisability: quoterData.tpd.enabled
      ? parseInt(quoterData.tpd.coverage, 10) * monthInFourYears
      : 0,
    sumInsuredForTotalPermanentInvalidity:
      quoterData.tpi.enabled && calendarYearAge(quoterData.birthDate) <= 55
        ? parseInt(quoterData.tpi.coverage, 10)
        : 0,
    sumInsuredForCancer: quoterData.cancer.enabled
      ? parseInt(quoterData.cancer.coverage, 10)
      : 0,
    accidentalDeath: quoterData.accidentalDeath,
    trafficAccidentalDeath: quoterData.trafficAccidentalDeath,
    smoker: quoterData.smoker === "yes",
    exemptionForPermanentDisability:
      quoterData.exemptionFromPaying &&
      calendarYearAge(quoterData.birthDate) <= 55,
    aggregate: 0,
  };

  return await post("/quoter", {payloadShape: getQuoteResponseSchema, data});
}
