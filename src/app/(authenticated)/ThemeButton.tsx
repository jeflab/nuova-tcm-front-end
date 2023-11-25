"use client";
import {faMoonStars, faSun} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useTheme} from "next-themes";
import {Button, NavLink} from "react-bootstrap";

export function ThemeButton() {
  const {theme, setTheme} = useTheme();

  return (
    <NavLink
      as={Button}
      variant="link"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? (
        <FontAwesomeIcon icon={faSun} />
      ) : (
        <FontAwesomeIcon icon={faMoonStars} />
      )}
    </NavLink>
  );
}
