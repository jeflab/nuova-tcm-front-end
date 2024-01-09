import {differenceInCalendarYears} from "date-fns/differenceInCalendarYears";
import {differenceInYears} from "date-fns/differenceInYears";

export const age = (date: string | Date) => {
  return differenceInYears(new Date(), date);
};

export const calendarYearAge = (date: string | Date) => {
  return differenceInCalendarYears(new Date(), date);
};
