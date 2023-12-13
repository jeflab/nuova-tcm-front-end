import {z} from "zod";

export const THEME_COOKIE_NAME = "tcm-theme";
export const DEFAULT_THEME = "light";
export const THEMES = ["light", "dark"] as const;
export const themeSchema = z.enum(THEMES).catch(DEFAULT_THEME);
export type Theme = z.infer<typeof themeSchema>;
