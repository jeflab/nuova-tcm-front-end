import {BeneficiariesForm} from "@/app/(menu)/(authenticated)/lipsDrawers/BeneficiariesForm";
import {BeneficiariesSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/BeneficiariesSummary";
import {ContractorDataForm} from "@/app/(menu)/(authenticated)/lipsDrawers/ContractorDataForm";
import {ContractorDataSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/ContractorDataSummary";
import {ContractorFiscalCodeForm} from "@/app/(menu)/(authenticated)/lipsDrawers/ContractorFiscalCodeForm";
import {ContractorFiscalCodeSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/ContractorFiscalCodeSummary";
import {ContractorPersonalAreaActivationModalContent} from "@/app/(menu)/(authenticated)/lipsDrawers/ContractorPersonalAreaActivationModalContent";
import {ContractorPersonalAreaActivationSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/ContractorPersonalAreaActivationSummary";
import {DenForm} from "@/app/(menu)/(authenticated)/lipsDrawers/DenForm";
import {DenSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/DenSummary";
import {DocumentsManagement} from "@/app/(menu)/(authenticated)/lipsDrawers/DocumentsManagement";
import {DocumentsSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/DocumentsSummary";
import {FatcaForm} from "@/app/(menu)/(authenticated)/lipsDrawers/FatcaForm";
import {FatcaSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/FatcaSummary";
import {HealthQuestionnaireForm} from "@/app/(menu)/(authenticated)/lipsDrawers/HealthQuestionnaireForm";
import {HealthQuestionnaireSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/HealthQuestionnaireSummary";
import {IdentificationForm} from "@/app/(menu)/(authenticated)/lipsDrawers/IdentificationForm";
import {IdentificationDataSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/IdentificationSummary";
import {PaymentForm} from "@/app/(menu)/(authenticated)/lipsDrawers/PaymentForm";
import {PaymentLock} from "@/app/(menu)/(authenticated)/lipsDrawers/PaymentLock";
import {PaymentSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/PaymentSummary";
import {QuoteForm} from "@/app/(menu)/(authenticated)/lipsDrawers/QuoteForm";
import {QuoteSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/QuoteSummary";
import {ReactNode} from "react";
import {ContractorPersonalAreaActivationLastPrivacy} from "../../lipsDrawers/ContractorPersonalAreaActivationLastPrivacy";
import {ContractorContactsForm} from "../../lipsDrawers/ContractorContactsForm";
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
  | "payment"
  | "documentation";
interface DrawerConfig {
  name: DrawerName;
  title: string;
  shortTitle?: string;
  modalContent?: ReactNode;
  summaryContent?: ReactNode;
  lock?: ReactNode;
}

export const drawers: DrawerConfig[] = [
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
    name: "contractorContacts",
    title: "Contatti contraente",
    modalContent: <ContractorContactsForm />,
    summaryContent: <ContractorContactsSummary />,
  },
  {
    name: "contractorPersonalAreaActivation",
    title: "Attivazione area contraente",
    modalContent: (
      <ContractorPersonalAreaActivationModalContent
        lastPrivacy={<ContractorPersonalAreaActivationLastPrivacy />}
      />
    ),
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
    modalContent: <QuoteForm />,
    summaryContent: <QuoteSummary />,
  },
  {
    name: "healthQuestionnaire",
    title: "Questionario sanitario / non sanitario",
    shortTitle: "Questionario sanitario",
    modalContent: <HealthQuestionnaireForm />,
    summaryContent: <HealthQuestionnaireSummary />,
  },
  {
    name: "beneficiaries",
    title: "Beneficiari",
    modalContent: <BeneficiariesForm />,
    summaryContent: <BeneficiariesSummary />,
  },
  {
    name: "payment",
    title: "Pagamento",
    modalContent: <PaymentForm />,
    summaryContent: <PaymentSummary />,
    lock: <PaymentLock />,
  },
  {
    name: "documentation",
    title: "Documentazione",
    modalContent: <DocumentsManagement />,
    summaryContent: <DocumentsSummary />,
  },
] as const;
