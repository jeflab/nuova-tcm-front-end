import {getContractorLips} from "@/app/(menu)/(authenticated)/contractorLips/actions";
import {Policy} from "@/app/(menu)/(authenticated)/contractorLips/Policy";
import {getAccount} from "@/app/(no-menu)/(auth)/actions";
import {normalizeErrorMessage} from "@/helpers/errors";
import {AppContainer} from "@/ui/AppContainer";
import {PageTitle} from "@/ui/PageTitle";
import {Alert} from "react-bootstrap";

export default async function ContractorLipsPage() {
  const contractorLips = await getContractorLips();
  const loggedUser = await getAccount();

  if (contractorLips.status !== "success") {
    throw normalizeErrorMessage(contractorLips);
  }

  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>Le tue polizze</PageTitle>
      {contractorLips.lips.map((lip) => (
        <Policy key={lip.id} lip={lip} contractor={contractorLips.contractor} />
      ))}
      {contractorLips.lips.length === 0 && (
        <Alert variant="info">Non hai ancora nessuna polizza</Alert>
      )}
    </AppContainer>
  );
}
