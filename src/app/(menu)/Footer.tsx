import {getAccount, isLoggedIn} from "@/app/(no-menu)/(auth)/actions";
import {getVersion} from "@/helpers/release";
import {Permission} from "@/models/account";
import {Broker} from "@/models/entities/broker";
import {AppContainer} from "@/ui/AppContainer";
import {getTheme} from "@/ui/Theme/actions";
import {faCopyright} from "@fortawesome/pro-duotone-svg-icons/faCopyright";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export async function Footer() {
  const currentYear = new Date().getFullYear();
  const loggedIn = await isLoggedIn();

  let broker: Broker | undefined;

  if (loggedIn) {
    const account = await getAccount();

    if (account.status === "success") {
      broker = account.broker;
    }
  }

  return (
    <AppContainer>
      <div className="hstack gap-3 mb-3">
        <div className="d-flex gap-2 align-items-center">
          <FontAwesomeIcon icon={faCopyright} className="text-primary" /> 2024
          {currentYear > 2024 ? ` - ${currentYear}` : ""} Piattaforma TCM
          {broker?.information.footer ? (
            <>
              <div> - </div>
              <div
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
