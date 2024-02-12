import {getContractorLips} from "@/app/(menu)/(authenticated)/contractorLips/actions";
import {Policy} from "@/app/(menu)/(authenticated)/contractorLips/Policy";
import {normalizeErrorMessage} from "@/helpers/errors";
import {AppContainer} from "@/ui/AppContainer";
import {PageTitle} from "@/ui/PageTitle";

export default async function ContractorLipsPage() {
  const contractorLips = await getContractorLips();

  if (contractorLips.status !== "success") {
    throw normalizeErrorMessage(contractorLips);
  }

  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>Le tue polizze</PageTitle>
      {contractorLips.lips.map((lip) => (
        <Policy key={lip.id} lip={lip} contractor={contractorLips.contractor} />
      ))}
    </AppContainer>
  );
}
