import {ContractorContactsForm} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorContacts/ContractorContactsForm";
import {getAccount} from "@/app/(no-menu)/(auth)/actions";

export async function ContractorContactsFormWrapper() {
  const accountResponse = await getAccount();

  if (!accountResponse || accountResponse.status !== "success") {
    throw new Error("Impossibile leggere dati account");
  }

  return (
    <ContractorContactsForm
      loggedUser={accountResponse.user}
      loggedUserRoles={accountResponse.roles}
    />
  );
}
