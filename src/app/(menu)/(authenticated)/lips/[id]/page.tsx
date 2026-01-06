import {LipDetails} from "@/app/(menu)/(authenticated)/lips/[id]/LipDetails";
import {
  getActiveFirstPaymentQuery,
  getActiveSubscriptionQuery,
  getLastPrivacyQuery,
  getLipQuery,
} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
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
  if (lipId !== "new") {
    void queryClient.prefetchQuery(getLastPrivacyQuery());
    void queryClient.prefetchQuery(getActiveFirstPaymentQuery(lipId));
    void queryClient.prefetchQuery(getActiveSubscriptionQuery(lipId));
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppContainer className="vstack gap-3 align-items-start">
        <LipDetails />
      </AppContainer>
    </HydrationBoundary>
  );
}
