import {QuoterForm} from "@/app/(authenticated)/quoter/QuoterForm";
import {AppContainer} from "@/ui/AppContainer";
import {PageTitle} from "@/ui/PageTitle";
import {Alert} from "react-bootstrap";

export default function Quoter() {
  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>Preventivatore</PageTitle>
      <Alert variant="info" className="mb-0">
        Si prega di compilare il form per il preventivo della polizza vita con
        attenzione alle normative vigenti e principi etici. Concentrarsi sul
        benessere del cliente, garantendo chiarezza, trasparenza e riservatezza
        nelle informazioni è fondamentale.
      </Alert>
      <QuoterForm />
    </AppContainer>
  );
}
