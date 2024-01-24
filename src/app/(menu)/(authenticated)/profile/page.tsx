import {getAccount} from "@/app/(no-menu)/(auth)/actions";
import {AppContainer} from "@/ui/AppContainer";
import {PageTitle} from "@/ui/PageTitle";

export default async function ProfilePage() {
  const userAccount = await getAccount();
  if (userAccount.status !== "success") {
    throw new Error("Errore imprevisto, riprova più tardi.");
  }

  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>Profilo utente</PageTitle>
      <h3>Account</h3>
      <dl>
        <dt>Codice fiscale:</dt>
        <dd>{userAccount.user.fiscalCode}</dd>
        <dt>Email:</dt>
        <dd>{userAccount.user.email}</dd>
        <dt>Numero di cellulare:</dt>
        <dd>{userAccount.user.phone}</dd>
      </dl>
    </AppContainer>
  );
}
