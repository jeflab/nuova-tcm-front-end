import {faPenToSquare} from "@fortawesome/pro-duotone-svg-icons";

export type DrawerVariant =
  | "success"
  | "danger"
  | "waiting"
  | "active"
  | "loading";

export type DrawerState = {
  variant: DrawerVariant;
  buttonLabel?: string;
  buttonIcon?: keyof typeof buttonMap;
};

export const presetButtons = {
  compile: {
    buttonIcon: "faPenToSquare",
    buttonLabel: "Compila",
  },
  privacyEsign: {
    buttonIcon: "faPenToSquare",
    buttonLabel: "Leggi e firma",
  },
  documentEsign: {
    buttonIcon: "faPenToSquare",
    buttonLabel: "Firma",
  },
} as const;

export const buttonMap = {
  faPenToSquare,
} as const;
