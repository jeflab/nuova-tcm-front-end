import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
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
  buttonIcon?: IconDefinition;
};

export const presetButtons = {
  compile: {
    buttonIcon: faPenToSquare,
    buttonLabel: "Compila",
  },
  privacyEsign: {
    buttonIcon: faPenToSquare,
    buttonLabel: "Leggi e firma",
  },
} as const;
