"use client";

import {getAccountQuery} from "@/app/(menu)/(authenticated)/queries";
import {AppContainer} from "@/ui/AppContainer";
import {PageTitle} from "@/ui/PageTitle";
import {useSuspenseQuery} from "@tanstack/react-query";

export default function OperatingManualPage() {
  const {
    data: {broker},
  } = useSuspenseQuery(getAccountQuery());

  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>
        Manuale Operativo F.E.A. - Servizio di Firma Elettronica Avanzata
      </PageTitle>
      <div
        dangerouslySetInnerHTML={{
          __html: broker?.information.manualeOperativo ?? "",
        }}
      />
    </AppContainer>
  );
}
