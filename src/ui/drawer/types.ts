import {
  faClipboardCheck,
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
  isLocked?: boolean;
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
  checkConsent: {
    buttonIcon: "faClipboardCheck",
    buttonLabel: "Controlla i consensi",
  },
} as const;

export const buttonMap = {
  faPenToSquare,
  faFileSignature,
  faClipboardCheck,
} as const;
