"use client";

import {AppContainer} from "@/ui/AppContainer";
import {ButtonLink} from "@/ui/ButtonLink";
import {PageTitle} from "@/ui/PageTitle";
import {
  faArrowRotateBack,
  faHouseChimney,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as Sentry from "@sentry/nextjs";
import {useEffect} from "react";
import {Alert, AlertHeading, Button} from "react-bootstrap";

export default function ContractorLipsErrorPage({
  error,
}: {
  error: Error & {digest?: string};
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>Le tue polizze</PageTitle>
      <Alert variant="danger" className="mb-0">
        <AlertHeading>Impossibile caricare le tue polizze</AlertHeading>
        <p className="mb-0">{error.message}</p>
      </Alert>
      <div>
        <Button
          onClick={() => {
            window.location.reload();
          }}
          type="button"
          className="me-2"
        >
          <FontAwesomeIcon icon={faArrowRotateBack} className="me-2" />
          Riprova
        </Button>
        <ButtonLink href="/" type="button">
          <FontAwesomeIcon icon={faHouseChimney} className="me-2" />
          Torna alla pagina principale
        </ButtonLink>
      </div>
    </AppContainer>
  );
}
