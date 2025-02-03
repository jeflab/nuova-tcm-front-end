import {BeneficiariesSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/beneficiaries/BeneficiariesSummary";
import {CertificateSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/certificate/CertificateSummary";
import {ContractorContactsSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorContacts/ContractorContactsSummary";
import {ContractorDataSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorData/ContractorDataSummary";
import {ContractorFiscalCodeSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorFiscalCode/ContractorFiscalCodeSummary";
import {ContractorPersonalAreaActivationSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorPersonalAreaActivation/ContractorPersonalAreaActivationSummary";
import {DenSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/den/DenSummary";
import {DocumentsSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/documents/DocumentsSummary";
import {FatcaSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/fatca/FatcaSummary";
import {HealthQuestionnaireSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/healthQuestionnaire/HealthQuestionnaireSummary";
import {IdentificationSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/identification/IdentificationSummary";
import {InsuredIdentificationSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/insuredIdentification/InsuredIdentificationSummary";
import {PaymentLock} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/PaymentLock";
import {PaymentSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/payment/PaymentSummary";
import {QuoteSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/QuoteSummary";
import {LipType} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {TypeSummary} from "@/app/(menu)/(authenticated)/lipsDrawers/type/TypeSummary";
import {ReactNode} from "react";
import {DrawerName} from "../../lips/[id]/drawers";
import {InsuredDataSummary} from "../../lipsDrawers/insuredData/InsuredDataSummary";

interface DrawerConfig {
  name: DrawerName;
  title: string;
  shortTitle?: string;
  summaryContent?: ReactNode;
  lock?: ReactNode;
  isVisible?: (lipType: LipType) => boolean;
}

export const drawers: DrawerConfig[] = [
  {
    name: "type",
    title: "Tipo di polizza",
    summaryContent: <TypeSummary />,
  },
  {
    name: "fatca",
    title: "Verifica residenza",
    summaryContent: <FatcaSummary />,
  },
  {
    name: "contractorFiscalCode",
    title: "Dati Contraente",
    summaryContent: <ContractorFiscalCodeSummary />,
  },
  {
    name: "contractorContacts",
    title: "Contatti Contraente",
    summaryContent: <ContractorContactsSummary />,
  },
  {
    name: "contractorPersonalAreaActivation",
    title: "Attivazione area Contraente",
    summaryContent: <ContractorPersonalAreaActivationSummary />,
  },
  {
    name: "contractorData",
    title: "Censimento Contraente",
    summaryContent: <ContractorDataSummary />,
  },
  {
    name: "identification",
    title: "Identificazione del Contraente",
    summaryContent: <IdentificationSummary />,
  },
  {
    name: "den",
    title:
      "Questionario per la coerenza del contratto rispetto alle richieste ed esigenze del Contraente",
    shortTitle: "Questionario di coerenza",
    summaryContent: <DenSummary />,
  },
  {
    name: "insuredData",
    title: "Censimento Assicurato",
    summaryContent: <InsuredDataSummary />,
    isVisible: (lipType) => lipType === "third-party-insured",
  },
  {
    name: "insuredIdentification",
    title: "Identificazione dell'Assicurato",
    summaryContent: <InsuredIdentificationSummary />,
    isVisible: (lipType) => lipType === "third-party-insured",
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
    lock: <PaymentLock hideUnderwritingAction={true} />,
  },
  {
    name: "documentation",
    title: "Documentazione",
    summaryContent: <DocumentsSummary />,
  },
  {
    name: "certificate",
    title: "Certificato",
    summaryContent: <CertificateSummary />,
  },
] as const;
