import {AppContainer} from "@/ui/AppContainer";
import {PageTitle} from "@/ui/PageTitle";
import {Alert, Stack} from "react-bootstrap";
import {QuoterForm} from "./QuoterForm";

export default async function Quoter() {
  return (
    <Stack gap={3}>
      <AppContainer className="vstack gap-3">
        <PageTitle>Preventivatore</PageTitle>
        <Alert variant="info" className="mb-0">
          Si prega di compilare il form per il preventivo della polizza vita con
          attenzione alle normative vigenti e principi etici. Concentrarsi sul
          benessere del cliente, garantendo chiarezza, trasparenza e
          riservatezza nelle informazioni è fondamentale.
        </Alert>
      </AppContainer>
      <QuoterForm />
    </Stack>
  );
}
