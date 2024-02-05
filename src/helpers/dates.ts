import {format} from "date-fns/format";
import {it} from "date-fns/locale";

const locale = {locale: it};

const dateOrNow = (date?: Date | string) => {
  return date ? date : new Date();
};

const datePattern = "dd MMMM yyyy";
export const dateString = (date?: Date | string) => {
  return format(dateOrNow(date), datePattern, locale);
};

const dbDatePattern = "yyyy-MM-dd";
export const dbDateString = (date?: Date | string) => {
  return format(dateOrNow(date), dbDatePattern, locale);
};
