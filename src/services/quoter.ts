"use server";

import {getCoverageDuration} from "@/app/(menu)/quoter/helpers";
import {calendarYearAge} from "@/helpers/ages";
import {post} from "@/services/api";
import {isServerError} from "@/services/helpers";
import {z} from "zod";

const getQuoteResponseSchema = {
  quotazione: z.object({
    premium: z.number(),
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
  try {
    const body = JSON.stringify({
      sumInsured: parseInt(quoterData.death),
      age: calendarYearAge(quoterData.birthDate),
      duration: getCoverageDuration(quoterData.birthDate),
      sumInsuredForTotalPermanentDisability: quoterData.tpd.enabled
        ? parseInt(quoterData.tpd.coverage, 10)
        : 0,
      sumInsuredForTotalPermanentInvalidity:
        quoterData.tpi.enabled && calendarYearAge(quoterData.birthDate) < 55
          ? parseInt(quoterData.tpi.coverage, 10)
          : 0,
      sumInsuredForCancer: quoterData.cancer.enabled
        ? parseInt(quoterData.cancer.coverage, 10)
        : 0,
      accidentalDeath: quoterData.accidentalDeath,
      trafficAccidentalDeath: quoterData.trafficAccidentalDeath,
      smoker: quoterData.smoker === "true",
      exemptionForPermanentDisability:
        quoterData.exemptionFromPaying &&
        calendarYearAge(quoterData.birthDate) < 55,
      aggregate: 0,
    });

    return await post("/quoter", getQuoteResponseSchema, body);
  } catch (e) {
    if (isServerError(e)) {
      return e;
    } else {
      throw e;
    }
  }
}
