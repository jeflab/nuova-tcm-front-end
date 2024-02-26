import {getVersion} from "@/helpers/release";
import {AppContainer} from "@/ui/AppContainer";
import {faCopyright} from "@fortawesome/pro-duotone-svg-icons/faCopyright";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <AppContainer>
      <p className="hstack gap-3">
        <span>
          <FontAwesomeIcon icon={faCopyright} className="text-primary" /> 2024
          {currentYear > 2024 ? ` - ${currentYear}` : ""} Piattaforma TCM
        </span>
        <span className="ms-auto text-muted small">
          Versione {getVersion()}
        </span>
      </p>
    </AppContainer>
  );
}
