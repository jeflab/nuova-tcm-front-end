"use client";
import {THEME_COOKIE_NAME, themeSchema} from "@/ui/Theme/consts";
import {getThemeClientSide} from "@/ui/Theme/helpers";
import {WithChildren} from "@/ui/types";
import Cookies from "js-cookie";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {ThemeContext} from "./ThemeContext";

export function ThemeProvider({children}: WithChildren) {
  const [isThemeSafe, setIsThemeSafe] = useState(false);
  const [theme, setThemeState] = useState(() => getThemeClientSide());

  useEffect(() => {
    setIsThemeSafe(true);
  }, []);

  const setTheme = useCallback((theme: string) => {
    const parsedTheme = themeSchema.parse(theme);
    Cookies.set(THEME_COOKIE_NAME, parsedTheme);
    window.document.documentElement.dataset.bsTheme = parsedTheme;
    setThemeState(parsedTheme);
  }, []);

  const providerValue = useMemo(
    () => ({theme, isThemeSafe, setTheme}),
    [theme, isThemeSafe, setTheme],
  );

  return (
    <ThemeContext.Provider value={providerValue}>
      {children}
    </ThemeContext.Provider>
  );
}
