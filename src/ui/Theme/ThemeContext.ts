import {Theme} from "@/ui/Theme/consts";
import {createContext} from "react";

interface SafeTheme {
  theme: Theme;
  isThemeSafe: true;
}

interface UnsafeTheme {
  theme: undefined; // is undefined on the server
  isThemeSafe: false;
}

export type ThemeContext = {
  setTheme: (theme: Theme) => void;
} & (SafeTheme | UnsafeTheme);

const defaultValue: ThemeContext = {
  theme: undefined,
  isThemeSafe: false,
  setTheme: () => {},
};

export const ThemeContext = createContext<ThemeContext>(defaultValue);
