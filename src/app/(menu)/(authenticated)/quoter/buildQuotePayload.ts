import {getCoverageDurationOld} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/ComplementaryCoverages";
import {calendarYearAge} from "@/helpers/ages";
import {z} from "zod";

export const getQuoteResponseSchema = {
  quotazione: z.object({
    premium: z.number(),
    originalPremium: z.number(),
    version: z.string(),
  }),
};

export interface GetQuoteParams {
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

export function buildQuotePayload(quoterData: GetQuoteParams) {
  const monthInFourYears = 48;
  return {
    sumInsured: parseInt(quoterData.death),
    age: calendarYearAge(quoterData.birthDate),
    duration: getCoverageDurationOld(quoterData.birthDate),
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
}
