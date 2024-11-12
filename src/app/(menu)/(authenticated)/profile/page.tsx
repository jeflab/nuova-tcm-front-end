import {AccountProfile} from "@/app/(menu)/(authenticated)/profile/AccountProfile";
import {AgentProfile} from "@/app/(menu)/(authenticated)/profile/AgentProfile";
import {ContractorProfile} from "@/app/(menu)/(authenticated)/profile/ContractorProfile";
import {getProfile} from "@/app/(no-menu)/(auth)/actions";
import {normalizeError} from "@/helpers/errors";
import {AppContainer} from "@/ui/AppContainer";
import {PageTitle} from "@/ui/PageTitle";

export default async function ProfilePage() {
  const userProfile = await getProfile();

  if (userProfile?.status !== "success") {
    throw normalizeError(userProfile);
  }

  const {user, agent, contractor} = userProfile;

  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>Profilo utente</PageTitle>
      <AccountProfile user={user} />
      {agent ? <AgentProfile agent={agent} /> : null}
      {contractor ? <ContractorProfile contractor={contractor} /> : null}
    </AppContainer>
  );
}
