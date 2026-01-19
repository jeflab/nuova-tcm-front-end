import {ContractorLipDetails} from "@/app/(menu)/(authenticated)/contractorLips/[id]/ContractorLipDetails";
import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {AppContainer} from "@/ui/AppContainer";
import {getQueryClient} from "@/ui/getQueryClient";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";

interface NewLipPageProps {
  params: Promise<{id: string}>;
}

export default async function NewLipPage(props: NewLipPageProps) {
  const {id} = await props.params;
  const lipId = validateLipIdOrNotFound(id);
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(getLipQuery(lipId));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppContainer className="vstack gap-3 align-items-start">
        <ContractorLipDetails />
      </AppContainer>
    </HydrationBoundary>
  );
}
