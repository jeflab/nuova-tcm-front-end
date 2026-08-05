"use client";

import {getAccountQuery} from "@/app/(menu)/(authenticated)/queries";
import {HelpLink} from "@/app/(menu)/HelpLink";
import {getVersion} from "@/helpers/release";
import {AppContainer} from "@/ui/AppContainer";
import {faCopyright} from "@fortawesome/pro-duotone-svg-icons/faCopyright";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSuspenseQuery} from "@tanstack/react-query";
import styles from "./Footer.module.scss";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const {
    data: {broker, user},
  } = useSuspenseQuery(getAccountQuery());

  return (
    <AppContainer>
      <div className="d-flex flex-wrap gap-3 mb-3 flex-column flex-md-row">
        <div className="d-flex gap-2 align-items-start align-items-md-center flex-column flex-md-row">
          <span>
            <FontAwesomeIcon icon={faCopyright} className="text-primary" /> 2024
            {currentYear > 2024 ? ` - ${currentYear}` : ""} Smart Broker Space
          </span>
          {broker?.information.footer ? (
            <>
              <div className={styles.divider}> - </div>
              <div
                className={styles.fromDb}
                dangerouslySetInnerHTML={{
                  __html: broker.information.footer,
                }}
              />
            </>
          ) : null}
          <span className={styles.divider}> | </span>
          <HelpLink className="footer-link" fiscalCode={user?.fiscalCode} />
        </div>
        <small className="ms-auto text-muted">Versione {getVersion()}</small>
      </div>
    </AppContainer>
  );
}
