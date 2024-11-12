import {ContractorFiscalCodeForm} from "@/app/(menu)/(authenticated)/lipsDrawers/contractorFiscalCode/ContractorFiscalCodeForm";
import {getAccount} from "@/app/(no-menu)/(auth)/actions";
import {normalizeError} from "@/helpers/errors";

// Usiamo uno schema come validazione vista la complessità del form e la dipendenza del cf con gli altri campi

export async function ContractorFiscalCodeModal() {
  const account = await getAccount();

  if (account?.status !== "success") {
    throw normalizeError(account);
  }

  return <ContractorFiscalCodeForm loggedUser={account.user} />;
}
