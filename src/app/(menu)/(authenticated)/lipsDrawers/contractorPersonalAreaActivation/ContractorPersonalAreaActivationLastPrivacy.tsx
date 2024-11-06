import {getLastPrivacy} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {ContractorPersonalAreaActivationLastPrivacyForm} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorPersonalAreaActivation/ContractorPersonalAreaActivationLastPrivacyForm";
import {normalizeError} from "@/helpers/errors";
import {Alert} from "react-bootstrap";

export async function ContractorPersonalAreaActivationLastPrivacy() {
  const lastPrivacy = await getLastPrivacy();

  if (lastPrivacy?.status !== "success") {
    return (
      <Alert variant="danger">
        {
          normalizeError(
            lastPrivacy,
            "Impossibile caricare l'ultima privacy, riprovare più tardi",
          ).message
        }
      </Alert>
    );
  }

  return (
    <ContractorPersonalAreaActivationLastPrivacyForm
      lastPrivacy={lastPrivacy.privacy}
    />
  );
}
