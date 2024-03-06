import styles from "@/app/(no-menu)/layout.module.scss";
import {ButtonLink} from "@/ui/ButtonLink";
import CenterLogoContent from "@/ui/CenterLogoContent";
import {faHouseChimney} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

const containerStyle = {"--content-width": "max-content"};
export default function NotFound() {
  return (
    <main className={styles.publicMain}>
      <CenterLogoContent style={containerStyle}>
        <h2>Pagina non trovata ☹</h2>
        <ButtonLink href="/" type="button" className="w-100">
          <FontAwesomeIcon icon={faHouseChimney} className="me-2" />
          Torna alla pagina principale
        </ButtonLink>
      </CenterLogoContent>
    </main>
  );
}
