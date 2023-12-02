import {AppContainer} from "@/ui/AppContainer";
import {faCopyright} from "@fortawesome/pro-duotone-svg-icons/faCopyright";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import appInfo from "../../../package.json";

export function Footer() {
  return (
    <AppContainer>
      <p className="hstack gap-3">
        <span>
          <FontAwesomeIcon icon={faCopyright} className="text-primary" /> 2021
          Nuova TCM
        </span>
        <span className="ms-auto text-muted small">
          Versione {appInfo.version}
        </span>
      </p>
    </AppContainer>
  );
}
