import {getLastPrivacy} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {ContractorPersonalAreaActivationLastPrivacyForm} from "@/app/(menu)/(authenticated)/lipsDrawers/ContractorPersonalAreaActivationLastPrivacyForm";
import {getProfile} from "@/app/(no-menu)/(auth)/actions";
import {Alert} from "react-bootstrap";

export async function ContractorPersonalAreaActivationLastPrivacy() {
  const lastPrivacy = await getLastPrivacy();
  const profile = await getProfile();

  if (lastPrivacy.status === "failed") {
    return (
      <Alert variant="danger">
        Impossibile caricare l'ultima privacy, riprovare più tardi
      </Alert>
    );
  }
  if (profile.status === "failed") {
    return (
      <Alert variant="danger">
        Impossibile caricare l'utente, riprovare più tardi
      </Alert>
    );
  }

  return (
    <ContractorPersonalAreaActivationLastPrivacyForm
      lastPrivacy={lastPrivacy.privacy}
      profile={profile}
    />
  );
}
