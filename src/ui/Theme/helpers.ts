import {DEFAULT_THEME, THEME_COOKIE_NAME, themeSchema} from "@/ui/Theme/consts";
import Cookies from "js-cookie";

export const getThemeClientSide = () => {
  if (typeof window === "undefined") {
    return undefined;
  }
  return themeSchema.parse(window.document.documentElement.dataset.bsTheme);
};

export const setThemeClientSide = (theme: string) => {
  Cookies.set(THEME_COOKIE_NAME, theme);
  window.document.documentElement.dataset.bsTheme = theme;
};
