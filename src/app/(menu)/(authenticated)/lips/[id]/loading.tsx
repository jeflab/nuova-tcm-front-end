import {drawers} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {cns} from "@/helpers/cns";
import {AppContainer} from "@/ui/AppContainer";
import {ButtonLink} from "@/ui/ButtonLink";
import {DrawerSkeleton} from "@/ui/drawer/Drawer";
import {NavDrawerSkeleton} from "@/ui/drawer/NavDrawer";
import {PageTitle} from "@/ui/PageTitle";
import {
  faArrowLeft,
  faTriangleExclamation,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, Col, Nav, Row} from "react-bootstrap";
import styles from "./page.module.scss";

const minWidthHack = {minWidth: "1px"};

export default async function NewLipPage() {
  return (
    <AppContainer className="vstack gap-3 align-items-start">
      <PageTitle>Caricamento polizza</PageTitle>
      <ButtonLink href="/lips">
        <FontAwesomeIcon icon={faArrowLeft} /> Torna all'elenco
      </ButtonLink>
      <Row className="flex-row-reverse">
        <Col md="auto">
          <Nav className={cns("flex-column", styles.connectedList)}>
            {drawers.map(({name, title, shortTitle}) => (
              <NavDrawerSkeleton key={name}>
                {shortTitle ?? title}
              </NavDrawerSkeleton>
            ))}
          </Nav>
        </Col>
        <Col className="d-flex flex-column gap-3" style={minWidthHack}>
          <Alert variant="info" className="mb-0">
            <h3>
              <FontAwesomeIcon icon={faTriangleExclamation} className="me-2" />
              Avviso legale: Contraente e Assicurato devono coincidere.
            </h3>
            <p>
              Ti diamo il benvenuto nell'app di calcolo preventivo per polizze
              vita. Ai fini legali, è obbligatorio che il Contraente coincida
              con l'assicurato durante la compilazione dei dati.
            </p>
            <p className="mb-0">
              Il Contraente è la persona responsabile della sottoscrizione della
              polizza, mentre l'assicurato è la persona per la quale la polizza
              viene stipulata. Affinché il processo sia conforme alle normative
              vigenti, i dettagli del Contraente e dell'assicurato devono
              corrispondere.
            </p>
          </Alert>
          {drawers.map(({name, title}) => (
            <DrawerSkeleton key={name} title={title} />
          ))}
        </Col>
      </Row>
    </AppContainer>
  );
}
