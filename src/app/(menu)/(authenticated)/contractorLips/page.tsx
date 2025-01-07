import {getContractorLips} from "@/app/(menu)/(authenticated)/contractorLips/actions";
import {Policy} from "@/app/(menu)/(authenticated)/contractorLips/Policy";
import {normalizeError} from "@/helpers/errors";
import {AppContainer} from "@/ui/AppContainer";
import {PageTitle} from "@/ui/PageTitle";
import {Alert} from "react-bootstrap";

export default async function ContractorLipsPage() {
  const contractorLips = await getContractorLips();

  if (contractorLips?.status !== "success") {
    throw normalizeError(contractorLips);
  }

  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>Le tue polizze</PageTitle>
      {contractorLips.contractor &&
        contractorLips.lips.map((lip) => (
          <Policy
            key={lip.id}
            lip={lip}
            insured={lip.insured}
            contractor={contractorLips.contractor!}
          />
        ))}
      {(!contractorLips.contractor || contractorLips.lips.length === 0) && (
        <Alert variant="info">Non hai ancora nessuna polizza</Alert>
      )}
    </AppContainer>
  );
}
