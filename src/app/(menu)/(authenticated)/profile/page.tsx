import {AppContainer} from "@/ui/AppContainer";
import {PageTitle} from "@/ui/PageTitle";

export default async function ProfilePage() {
  // await getAccount();

  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>Profilo utente</PageTitle>
    </AppContainer>
  );
}
