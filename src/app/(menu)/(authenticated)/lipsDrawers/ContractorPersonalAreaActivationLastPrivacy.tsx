import {getLastPrivacy} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {ContractorPersonalAreaActivationLastPrivacyForm} from "@/app/(menu)/(authenticated)/lipsDrawers/ContractorPersonalAreaActivationLastPrivacyForm";
import {Alert} from "react-bootstrap";

export async function ContractorPersonalAreaActivationLastPrivacy() {
  const lastPrivacy = await getLastPrivacy();

  if (lastPrivacy.status !== "success") {
    return (
      <Alert variant="danger">
        Impossibile caricare l'ultima privacy, riprovare più tardi
      </Alert>
    );
  }

  return (
    <ContractorPersonalAreaActivationLastPrivacyForm
      lastPrivacy={lastPrivacy.privacy}
    />
  );
}
