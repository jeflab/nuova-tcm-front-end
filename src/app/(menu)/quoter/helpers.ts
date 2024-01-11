import {calendarYearAge} from "@/helpers/ages";

export const getCoverageDuration = (
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
