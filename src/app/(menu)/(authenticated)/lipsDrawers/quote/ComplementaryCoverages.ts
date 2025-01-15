import {calendarYearAge} from "@/helpers/ages";

export const mainCoverage = {
  key: "death",
  label: "Caso morte",
  valueLabel: "Capitale assicurato",
  maxDuration: 30,
  maxAge: 85,
  minCoverage: 20_000,
  maxCoverage: 300_000,
} as const;

export const complementaryCoverages = {
  accidentalDeath: {
    key: "accidentalDeath",
    label: "Morte da infortunio",
    valueLabel: "Capitale assicurato",
    maxDuration: 30,
    maxAge: 85,
  },
  trafficAccidentalDeath: {
    key: "trafficAccidentalDeath",
    label: "Morte per incidente stradale",
    valueLabel: "Capitale assicurato",
    maxDuration: 30,
    maxAge: 85,
  },
  exemptionFromPaying: {
    key: "exemptionFromPaying",
    label: "Esenzione dal pagamento dei premi",
    valueLabel: "Attiva",
    maxDuration: 30,
    maxAge: 65,
  },
  tpi: {
    key: "tpi",
    label: "Invalidità permanente da infortunio o malattia",
    valueLabel: "Capitale assicurato",
    maxDuration: 10,
    maxAge: 65,
    minCoverage: mainCoverage.minCoverage,
    maxCoverage: Math.min(300_000, mainCoverage.maxCoverage),
  },
  cancer: {
    key: "cancer",
    label: "Cancro",
    valueLabel: "Capitale assicurato",
    maxDuration: 10,
    maxAge: 65,
    minCoverage: mainCoverage.minCoverage,
    maxCoverage: Math.min(100_000, mainCoverage.maxCoverage),
  },
  tpd: {
    key: "tpd",
    label: "Perdita totale di autosufficienza",
    valueLabel: "Rendita mensile",
    maxDuration: 30,
    maxAge: 85,
    minCoverage: mainCoverage.minCoverage,
    maxCoverage: Math.min(100_000, mainCoverage.maxCoverage),
  },
} as const;

export type ComplementaryCoverageKey = keyof typeof complementaryCoverages;
export type ComplementaryCoverage =
  (typeof complementaryCoverages)[ComplementaryCoverageKey];

export const getCoverageDurationOld = (
  birthDate: string | Date,
  maxDuration: number = 30,
  maxAge: number = 85,
) => {
  if (!birthDate) {
    return maxDuration;
  }
  const fullYearsAge = calendarYearAge(birthDate);
  const yearsToMaxAge = maxAge - fullYearsAge;
  return Math.max(0, Math.min(yearsToMaxAge, maxDuration));
};

export function getCoverageDuration(
  key: ComplementaryCoverageKey | "death",
  birthDate: string | Date,
) {
  const coverage = key === "death" ? mainCoverage : complementaryCoverages[key];
  if (!coverage) {
    throw new Error(`Invalid coverage key: ${key}`);
  }

  const {maxDuration, maxAge} = coverage;

  if (!birthDate) {
    return maxDuration;
  }

  const fullYearsAge = calendarYearAge(birthDate);
  const yearsToMaxAge = maxAge - fullYearsAge;
  return Math.max(0, Math.min(yearsToMaxAge, maxDuration));
}

// Deprecated
// Vecchia implementazione, si può cancellare? Ultimo uso 2025-01-15
// export const complementaryCoverages = (() => {
//   const coverages = [
//     {
//       key: "accidentalDeath",
//       label: "Morte da infortunio",
//       valueLabel: "Capitale assicurato",
//       maxDuration: 30,
//       maxAge: 85,
//     },
//     {
//       key: "trafficAccidentalDeath",
//       label: "Morte per incidente stradale",
//       valueLabel: "Capitale assicurato",
//       maxDuration: 30,
//       maxAge: 85,
//     },
//     {
//       key: "exemptionFromPaying",
//       label: "Esenzione dal pagamento dei premi",
//       valueLabel: "Attiva",
//       maxDuration: 30,
//       maxAge: 65,
//     },
//     {
//       key: "tpi",
//       label: "Invalidità permanente da infortunio o malattia",
//       valueLabel: "Capitale assicurato",
//       maxDuration: 10,
//       maxAge: 65,
//       maxCoverage: 300_000,
//     },
//     {
//       key: "cancer",
//       label: "Cancro",
//       valueLabel: "Capitale assicurato",
//       maxDuration: 10,
//       maxAge: 65,
//       maxCoverage: 100_000,
//     },
//     {
//       key: "tpd",
//       label: "Perdita totale di autosufficienza",
//       valueLabel: "Rendita mensile",
//       maxDuration: 30,
//       maxAge: 85,
//       maxCoverage: 100_000,
//     },
//   ] as const;
//
//   function get<T extends (typeof coverages)[number]["key"]>(
//     key: T,
//   ): Extract<(typeof coverages)[number], {key: T}> {
//     return coverages.find((coverage) => coverage.key === key) as Extract<
//       (typeof coverages)[number],
//       {key: T}
//     >;
//   }
//
//   return {
//     all() {
//       return coverages;
//     },
//     get accidentalDeath() {
//       return get("accidentalDeath");
//     },
//     get trafficAccidentalDeath() {
//       return get("trafficAccidentalDeath");
//     },
//     get exemptionFromPaying() {
//       return get("exemptionFromPaying");
//     },
//     get tpi() {
//       return get("tpi");
//     },
//     get cancer() {
//       return get("cancer");
//     },
//     get tpd() {
//       return get("tpd");
//     },
//   };
// })();
