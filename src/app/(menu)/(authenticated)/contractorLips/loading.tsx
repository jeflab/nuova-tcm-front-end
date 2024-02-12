import {PolicySkeleton} from "@/app/(menu)/(authenticated)/contractorLips/Policy";
import {AppContainer} from "@/ui/AppContainer";
import {PageTitle} from "@/ui/PageTitle";

export default function ContractorLipsLoadingPage() {
  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>Le tue polizze</PageTitle>
      <PolicySkeleton />
    </AppContainer>
  );
}
