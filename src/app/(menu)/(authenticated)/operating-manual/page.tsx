import {getAccount} from "@/app/(no-menu)/(auth)/actions";
import {AppContainer} from "@/ui/AppContainer";
import {PageTitle} from "@/ui/PageTitle";

export default async function OperatingManualPage() {
  const account = await getAccount();

  if (account.status !== "success") {
    throw new Error(account.message);
  }

  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>
        Manuale Operativo F.E.A. - Servizio di Firma Elettronica Avanzata
      </PageTitle>
      <div
        dangerouslySetInnerHTML={{
          __html: account.broker?.information.manualeOperativo ?? "",
        }}
      />
    </AppContainer>
  );
}
