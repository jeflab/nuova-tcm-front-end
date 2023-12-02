import format from "date-fns/format";
import {it} from "date-fns/locale";

const locale = {locale: it};

const dateOrNow = (date?: Date) => {
  return date ? date : new Date();
};

const datePattern = "dd MMMM yyyy";
export const dateString = (date?: Date) => {
  return format(dateOrNow(date), datePattern, locale);
};

const dbDatePattern = "yyyy-MM-dd";
export const dbDateString = (date?: Date) => {
  return format(dateOrNow(date), dbDatePattern, locale);
};
