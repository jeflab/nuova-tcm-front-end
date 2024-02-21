"use client";

import styles from "@/app/(no-menu)/layout.module.scss";
import {ButtonLink} from "@/ui/ButtonLink";
import CenterLogoContent from "@/ui/CenterLogoContent";
import {Debug} from "@/ui/Debug";
import {Providers} from "@/ui/Providers";
import {getTheme} from "@/ui/Theme/actions";
import {
  faArrowRotateBack,
  faHouseChimney,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as Sentry from "@sentry/nextjs";
import {useEffect} from "react";
import {Button} from "react-bootstrap";

const containerStyle = {"--content-width": "max-content"};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & {digest?: string};
  reset: () => void;
}) {
  const theme = getTheme();

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="it" data-bs-theme={theme}>
      <body>
        <Providers>
          <main className={styles.publicMain}>
            <CenterLogoContent style={containerStyle}>
              <h2>Qualcosa è andato storto 😕</h2>
              <Button onClick={() => reset()} type="button" className="w-100">
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
          </main>
        </Providers>
      </body>
    </html>
  );
}
