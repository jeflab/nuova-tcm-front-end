import {ContractorFiscalCodeForm} from "@/app/(menu)/(authenticated)/lipsDrawers/ContractorFiscalCodeForm";
import {getAccount} from "@/app/(no-menu)/(auth)/actions";

// Usiamo uno schema come validazione vista la complessità del form e la dipendenza del cf con gli altri campi

export async function ContractorFiscalCodeModal() {
  const account = await getAccount();

  if (account.status === "failed") {
    throw new Error(account.message);
  }

  return <ContractorFiscalCodeForm loggedUser={account.user} />;
}
