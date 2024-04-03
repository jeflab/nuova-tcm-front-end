import {BeneficiariesSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/BeneficiariesSummary";
import {ContractorDataSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/ContractorDataSummary";
import {ContractorFiscalCodeSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/ContractorFiscalCodeSummary";
import {ContractorPersonalAreaActivationSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/ContractorPersonalAreaActivationSummary";
import {DenSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/DenSummary";
import {DocumentsSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/DocumentsSummary";
import {FatcaSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/FatcaSummary";
import {HealthQuestionnaireSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/HealthQuestionnaireSummary";
import {IdentificationDataSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/IdentificationSummary";
import {PaymentSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/PaymentSummary";
import {QuoteSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/QuoteSummary";
import {ReactNode} from "react";
import {ContractorContactsSummary} from "../../lipsDrawers/ContractorContactsSummary";

export type DrawerName =
  | "fatca"
  | "contractorFiscalCode"
  | "contractorContacts"
  | "contractorPersonalAreaActivation"
  | "contractorData"
  | "identification"
  | "den"
  | "quote"
  | "healthQuestionnaire"
  | "beneficiaries"
  | "documentation"
  | "payment";
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
    summaryContent: <FatcaSummary />,
  },
  {
    name: "contractorFiscalCode",
    title: "Dati contraente",
    summaryContent: <ContractorFiscalCodeSummary />,
  },
  {
    name: "contractorContacts",
    title: "Contatti contraente",
    summaryContent: <ContractorContactsSummary />,
  },
  {
    name: "contractorPersonalAreaActivation",
    title: "Attivazione area contraente",
    summaryContent: <ContractorPersonalAreaActivationSummary />,
  },
  {
    name: "contractorData",
    title: "Censimento contraente",
    summaryContent: <ContractorDataSummary />,
  },
  {
    name: "identification",
    title: "Identificazione del cliente",
    summaryContent: <IdentificationDataSummary />,
  },
  {
    name: "den",
    title:
      "Questionario per la coerenza del contratto rispetto alle richieste ed esigenze del cliente",
    shortTitle: "Questionario di coerenza",
    summaryContent: <DenSummary />,
  },
  {
    name: "quote",
    title: "Preventivo",
    summaryContent: <QuoteSummary />,
  },
  {
    name: "healthQuestionnaire",
    title: "Questionario sanitario / non sanitario",
    shortTitle: "Questionario sanitario",
    summaryContent: <HealthQuestionnaireSummary />,
  },
  {
    name: "beneficiaries",
    title: "Beneficiari",
    summaryContent: <BeneficiariesSummary />,
  },
  {
    name: "payment",
    title: "Pagamento",
    summaryContent: <PaymentSummary />,
  },
  {
    name: "documentation",
    title: "Documentazione",
    summaryContent: <DocumentsSummary />,
  },
];
