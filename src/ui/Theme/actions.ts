"use server";

import {THEME_COOKIE_NAME, themeSchema} from "@/ui/Theme/consts";
import {cookies} from "next/headers";

export const getTheme = async () => {
  const theme = themeSchema.parse(
    (await cookies()).get(THEME_COOKIE_NAME)?.value,
  );
  return themeSchema.parse(theme);
};

export const setTheme = async (theme: string) => {
  (await cookies()).set(THEME_COOKIE_NAME, theme);
};
