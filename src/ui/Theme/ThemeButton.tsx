"use client";
import {Theme} from "@/ui/Theme/consts";
import {ThemeContext} from "@/ui/Theme/ThemeContext";
import {faMoonStars, faSun} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useContext} from "react";
import {Button, NavLink} from "react-bootstrap";

export function ThemeButton({defaultTheme}: {defaultTheme: Theme}) {
  const {theme, isThemeSafe, setTheme} = useContext(ThemeContext);

  const safeTheme = isThemeSafe ? theme : defaultTheme;

  return (
    <NavLink
      as={Button}
      variant="link"
      onClick={() => {
        setTheme(theme === "dark" ? "light" : "dark");
      }}
      title={`Passa al tema ${safeTheme === "dark" ? "chiaro" : "scuro"}`}
      className="text-start"
    >
      {safeTheme === "dark" ? (
        <FontAwesomeIcon icon={faMoonStars} />
      ) : (
        <FontAwesomeIcon icon={faSun} />
      )}
    </NavLink>
  );
}
