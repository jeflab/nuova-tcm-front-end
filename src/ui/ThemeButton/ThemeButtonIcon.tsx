import {getTheme} from "@/ui/ThemeButton/actions";
import {faMoonStars, faSun} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export function ThemeButtonIcon() {
  const theme = getTheme();

  if (theme === "light") {
    return <FontAwesomeIcon icon={faSun} />;
  }
  return <FontAwesomeIcon icon={faMoonStars} />;
}
