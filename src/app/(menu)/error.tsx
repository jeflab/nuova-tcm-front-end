"use client";

import {useRouter} from "next/navigation";
import {ButtonLink} from "@/ui/ButtonLink";
import CenterLogoContent from "@/ui/CenterLogoContent";
import {Debug} from "@/ui/Debug";
import {
  faArrowRotateBack,
  faHouseChimney,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as Sentry from "@sentry/nextjs";
import {startTransition, useEffect} from "react";
import {Button} from "react-bootstrap";

const containerStyle = {"--content-width": "max-content"};

export default function Error({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      Sentry.captureException(error);
    }
  }, [error]);

  const refresh = () => {
    router.refresh();
    startTransition(() => {
      reset();
    });
  };

  return (
    <CenterLogoContent style={containerStyle}>
      <h2>Qualcosa è andato storto 😕</h2>
      <Button onClick={refresh} type="button" className="w-100">
        <FontAwesomeIcon icon={faArrowRotateBack} className="me-2" />
        Riprova
      </Button>
      <ButtonLink href="/" type="button" className="w-100">
        <FontAwesomeIcon icon={faHouseChimney} className="me-2" />
        Torna alla pagina principale
      </ButtonLink>
      {process.env.NODE_ENV === "development" && (
        <>
          <h3>{error.name}</h3>
          <p>{error.message}</p>
          <Debug>{error}</Debug>
        </>
      )}
    </CenterLogoContent>
  );
}
