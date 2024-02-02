import {ContractorDataForm} from "@/app/(menu)/(authenticated)/lips/[id]/ContractorDataForm";
import {ContractorDataSummary} from "@/app/(menu)/(authenticated)/lips/[id]/ContractorDataSummary";
import {ContractorFiscalCodeForm} from "@/app/(menu)/(authenticated)/lips/[id]/ContractorFiscalCodeForm";
import {ContractorFiscalCodeSummary} from "@/app/(menu)/(authenticated)/lips/[id]/ContractorFiscalCodeSummary";
import {ContractorPersonalAreaActivationSummary} from "@/app/(menu)/(authenticated)/lips/[id]/ContractorPersonalAreaActivationSummary";
import {DenForm} from "@/app/(menu)/(authenticated)/lips/[id]/DenForm";
import {DenSummary} from "@/app/(menu)/(authenticated)/lips/[id]/DenSummary";
import {FatcaForm} from "@/app/(menu)/(authenticated)/lips/[id]/FatcaForm";
import {FatcaSummary} from "@/app/(menu)/(authenticated)/lips/[id]/FatcaSummary";
import {IdentificationForm} from "@/app/(menu)/(authenticated)/lips/[id]/IdentificationForm";
import {IdentificationDataSummary} from "@/app/(menu)/(authenticated)/lips/[id]/IdentificationSummary";
import {ReactNode} from "react";

export type DrawerName =
  | "fatca"
  | "contractorFiscalCode"
  | "contractorPersonalAreaActivation"
  | "contractorData"
  | "identification"
  | "den"
  | "adequacy"
  | "quote"
  | "health"
  | "insured"
  | "beneficiaries";
interface Drawer {
  name: DrawerName;
  title: string;
  shortTitle?: string;
  modalContent?: ReactNode;
  summaryContent?: ReactNode;
}
export const drawers: Drawer[] = [
  {
    name: "fatca",
    title: "Verifica residenza USA",
    modalContent: <FatcaForm />,
    summaryContent: <FatcaSummary />,
  },
  {
    name: "contractorFiscalCode",
    title: "Dati contraente",
    modalContent: <ContractorFiscalCodeForm />,
    summaryContent: <ContractorFiscalCodeSummary />,
  },
  {
    name: "contractorPersonalAreaActivation",
    title: "Attivazione area contraente",
    summaryContent: <ContractorPersonalAreaActivationSummary />,
  },
  {
    name: "contractorData",
    title: "Censimento contraente",
    modalContent: <ContractorDataForm />,
    summaryContent: <ContractorDataSummary />,
  },
  {
    name: "identification",
    title: "Identificazione del cliente",
    modalContent: <IdentificationForm />,
    summaryContent: <IdentificationDataSummary />,
  },
  {
    name: "den",
    title:
      "Questionario per la coerenza del contratto rispetto alle richieste ed esigenze del cliente",
    shortTitle: "Questionario di coerenza",
    modalContent: <DenForm />,
    summaryContent: <DenSummary />,
  },
  {
    name: "quote",
    title: "Preventivo",
  },
  {
    name: "health",
    title: "Questionario sanitario / non sanitario",
  },
  {
    name: "insured",
    title: "Assicurato",
  },
  {
    name: "beneficiaries",
    title: "Beneficiari",
  },
];
