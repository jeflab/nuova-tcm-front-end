"use server";

import {THEME_COOKIE_NAME, themeSchema} from "@/ui/Theme/consts";
import {cookies} from "next/headers";

export const getTheme = () => {
  const theme = themeSchema.parse(cookies().get(THEME_COOKIE_NAME)?.value);
  return themeSchema.parse(theme);
};

export const setTheme = (theme: string) => {
  cookies().set(THEME_COOKIE_NAME, theme);
};
