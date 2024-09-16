import {BeneficiariesForm} from "@/app/(menu)/(authenticated)/lipsDrawers/beneficiaries/BeneficiariesForm";
import {BeneficiariesSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/beneficiaries/BeneficiariesSummary";
import {CertificateSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/certificate/CertificateSummary";
import {ContractorContactsFormWrapper} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorContacts/ContractorContactsFormWrapper";
import {ContractorDataForm} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorData/ContractorDataForm";
import {ContractorDataSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorData/ContractorDataSummary";
import {ContractorFiscalCodeModal} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorFiscalCode/ContractorFiscalCodeModal";
import {ContractorFiscalCodeSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorFiscalCode/ContractorFiscalCodeSummary";
import {ContractorPersonalAreaActivationModalContent} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorPersonalAreaActivation/ContractorPersonalAreaActivationModalContent";
import {ContractorPersonalAreaActivationSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorPersonalAreaActivation/ContractorPersonalAreaActivationSummary";
import {DenForm} from "@/app/(menu)/(authenticated)/lipsDrawers/den/DenForm";
import {DenSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/den/DenSummary";
import {DocumentsLock} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsLock";
import {DocumentsModal} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsModal";
import {DocumentsSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsSummary";
import {FatcaForm} from "@/app/(menu)/(authenticated)/lipsDrawers/facta/FatcaForm";
import {FatcaSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/facta/FatcaSummary";
import {HealthQuestionnaireForm} from "@/app/(menu)/(authenticated)/lipsDrawers/healthQuestionnaire/HealthQuestionnaireForm";
import {HealthQuestionnaireSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/healthQuestionnaire/HealthQuestionnaireSummary";
import {IdentificationForm} from "@/app/(menu)/(authenticated)/lipsDrawers/identification/IdentificationForm";
import {IdentificationDataSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/identification/IdentificationSummary";
import {PaymentForm} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/PaymentForm";
import {PaymentLock} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/PaymentLock";
import {PaymentSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/PaymentSummary";
import {QuoteForm} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/QuoteForm";
import {QuoteSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/QuoteSummary";
import {ReactNode} from "react";
import {ContractorContactsSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorContacts/ContractorContactsSummary";
import {ContractorPersonalAreaActivationLastPrivacy} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorPersonalAreaActivation/ContractorPersonalAreaActivationLastPrivacy";

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
  | "documentation"
  | "certificate";
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
    title: "Verifica residenza",
    modalContent: <FatcaForm />,
    summaryContent: <FatcaSummary />,
  },
  {
    name: "contractorFiscalCode",
    title: "Dati Contraente",
    modalContent: <ContractorFiscalCodeModal />,
    summaryContent: <ContractorFiscalCodeSummary />,
  },
  {
    name: "contractorContacts",
    title: "Contatti Contraente",
    modalContent: <ContractorContactsFormWrapper />,
    summaryContent: <ContractorContactsSummary />,
  },
  {
    name: "contractorPersonalAreaActivation",
    title: "Attivazione area Contraente",
    modalContent: (
      <ContractorPersonalAreaActivationModalContent
        lastPrivacy={<ContractorPersonalAreaActivationLastPrivacy />}
      />
    ),
    summaryContent: <ContractorPersonalAreaActivationSummary />,
  },
  {
    name: "contractorData",
    title: "Censimento Contraente",
    modalContent: <ContractorDataForm />,
    summaryContent: <ContractorDataSummary />,
  },
  {
    name: "identification",
    title: "Identificazione del Contraente",
    modalContent: <IdentificationForm />,
    summaryContent: <IdentificationDataSummary />,
  },
  {
    name: "den",
    title:
      "Questionario per la coerenza del contratto rispetto alle richieste ed esigenze del Contraente",
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
    modalContent: <DocumentsModal />,
    summaryContent: <DocumentsSummary />,
    lock: <DocumentsLock />,
  },
  {
    name: "certificate",
    title: "Certificato",
    summaryContent: <CertificateSummary />,
  },
] as const;
