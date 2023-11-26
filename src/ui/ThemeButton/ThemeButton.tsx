"use client";
import {setTheme} from "@/ui/ThemeButton/actions";
import {WithChildren} from "@/ui/types";
import {Button, NavLink} from "react-bootstrap";

const getThemeClientSide = () => {
  if (typeof window === "undefined") {
    return undefined;
  }
  return window.document.documentElement.dataset.bsTheme;
};

const setThemeClientSide = (theme: string) => {
  window.document.documentElement.dataset.bsTheme = theme;
};

export function ThemeButton({children}: WithChildren) {
  const theme = getThemeClientSide();
  return (
    <NavLink
      as={Button}
      variant="link"
      onClick={() => {
        setThemeClientSide(theme === "light" ? "dark" : "light");
        setTheme(theme === "light" ? "dark" : "light");
      }}
    >
      {children}
    </NavLink>
  );
}
