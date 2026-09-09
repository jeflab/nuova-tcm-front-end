import {ContractorLipDetails} from "@/app/(menu)/(authenticated)/contractorLips/[id]/ContractorLipDetails";
import {lipQueryFor} from "@/app/(menu)/(authenticated)/lipsDrawers/lipQuery";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {AppContainer} from "@/ui/AppContainer";
import {getQueryClient} from "@/ui/getQueryClient";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";

interface ContractorLipPageProps {
  params: Promise<{id: string}>;
}

export default async function ContractorLipPage(props: ContractorLipPageProps) {
  const {id} = await props.params;
  const lipId = validateLipIdOrNotFound(id);
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(lipQueryFor("contractor", lipId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppContainer className="vstack gap-3 align-items-start">
        <ContractorLipDetails />
      </AppContainer>
    </HydrationBoundary>
  );
}
