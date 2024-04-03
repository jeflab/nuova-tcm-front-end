import {
  faFileSignature,
  faPenToSquare,
} from "@fortawesome/pro-duotone-svg-icons";

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
    buttonIcon: "faFileSignature",
    buttonLabel: "Leggi e firma",
  },
  documentEsign: {
    buttonIcon: "faFileSignature",
    buttonLabel: "Firma",
  },
  update: {
    buttonIcon: "faPenToSquare",
    buttonLabel: "Aggiorna",
  },
} as const;

export const buttonMap = {
  faPenToSquare,
  faFileSignature,
} as const;
