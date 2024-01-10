import {calendarYearAge} from "@/helpers/ages";

export const getCoverageDuration = (
  birthDate: string | Date,
  maxDuration: number = 30,
  maxAge: number = 85,
  includeMaxAge: boolean = true,
) => {
  if (!birthDate) {
    return maxDuration;
  }
  const fullYearsAge = calendarYearAge(birthDate);
  const yearsToMaxAge = maxAge - fullYearsAge + (includeMaxAge ? 1 : 0);
  return Math.max(0, Math.min(yearsToMaxAge, maxDuration));
};
