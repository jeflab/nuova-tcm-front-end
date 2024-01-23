import {
  faCheckCircle,
  faCircleHalf,
  faDollarCircle,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactNode} from "react";
import {z} from "zod";

export const lipStates = ["open", "payment_pending", "complete"] as const;
export type LipStatesKeys = (typeof lipStates)[number];

export const lipSchema = z.object({
  id: z.number(),
  surname: z.string(),
  name: z.string(),
  date: z.coerce.date(),
  state: z.enum(lipStates),
});

export type Lip = z.infer<typeof lipSchema>;

export const lipStatesLabels: Record<LipStatesKeys, string> = {
  open: "Aperta",
  payment_pending: "In attesa di pagamento",
  complete: "Completata",
} as const;

export const LipStatesIcons: Record<LipStatesKeys, ReactNode> = {
  open: <FontAwesomeIcon icon={faCircleHalf} className="text-warning" />,
  payment_pending: (
    <FontAwesomeIcon icon={faDollarCircle} className="text-warning" />
  ),
  complete: <FontAwesomeIcon icon={faCheckCircle} className="text-success" />,
} as const;

// TODO: sistemare interfaccia
export interface TempLipData {
  agentId?: number;
  fatca?: boolean;
  contractorFiscalCode?: {
    birthDate: string;
    birthPlace: {
      city: string;
      province: string;
    };
    fiscalCode: string;
    gender: "M" | "F";
    name: string;
    surname: string;
  };
  contractorPersonalAreaActivation?: string;
}
