import {getAccount, isLoggedIn} from "@/app/(no-menu)/(auth)/actions";
import {getVersion} from "@/helpers/release";
import {Broker} from "@/models/entities/broker";
import {AppContainer} from "@/ui/AppContainer";
import {faCopyright} from "@fortawesome/pro-duotone-svg-icons/faCopyright";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import styles from "./Footer.module.scss";

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const loggedIn = await isLoggedIn();

  let broker: Broker | undefined | null;

  if (loggedIn) {
    const account = await getAccount();

    if (account.status === "success") {
      broker = account.broker;
    }
  }

  return (
    <AppContainer>
      <div className="d-flex flex-wrap gap-3 mb-3 flex-column flex-sm-row">
        <div className="d-flex gap-2 align-items-start align-items-sm-center flex-column flex-sm-row">
          <span>
            <FontAwesomeIcon icon={faCopyright} className="text-primary" /> 2024
            {currentYear > 2023 ? ` - ${currentYear}` : ""} Smart Broker Space
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
        </div>
        <span className="ms-auto text-muted small">
          Versione {getVersion()}
        </span>
      </div>
    </AppContainer>
  );
}
