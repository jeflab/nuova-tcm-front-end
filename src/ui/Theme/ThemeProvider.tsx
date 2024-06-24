"use client";

import {THEME_COOKIE_NAME, themeSchema} from "@/ui/Theme/consts";
import {getThemeClientSide} from "@/ui/Theme/helpers";
import {WithChildren} from "@/ui/types";
import Cookies from "js-cookie";
import {useCallback, useEffect, useMemo, useState} from "react";
import {ThemeContext} from "./ThemeContext";

export function ThemeProvider({children}: WithChildren) {
  const [isThemeSafe, setIsThemeSafe] = useState(false);
  const [theme, setThemeState] = useState(() => getThemeClientSide());

  useEffect(() => {
    setIsThemeSafe(true);
  }, []);

  const setTheme = useCallback((theme: string) => {
    const parsedTheme = themeSchema.parse(theme);
    setThemeState(parsedTheme);
  }, []);

  useEffect(() => {
    if (theme) {
      Cookies.set(THEME_COOKIE_NAME, theme);
      window.document.documentElement.dataset.bsTheme = theme;
    }
  }, [theme]);

  const providerValue = useMemo(
    () => ({theme, isThemeSafe, setTheme}) as ThemeContext,
    [theme, isThemeSafe, setTheme],
  );

  return (
    <ThemeContext.Provider value={providerValue}>
      {children}
    </ThemeContext.Provider>
  );
}
