import styles from "@/app/(menu)/(authenticated)/lips/[id]/page.module.scss";
import {cns} from "@/helpers/cns";
import {AppContainer} from "@/ui/AppContainer";
import {DrawerSkeleton} from "@/ui/drawer/Drawer";
import {NavDrawerSkeleton} from "@/ui/drawer/NavDrawer";
import {PageTitle} from "@/ui/PageTitle";
import {faTriangleExclamation} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, Col, Nav, Row} from "react-bootstrap";

export default async function NewLipPage() {
  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>Nuova polizza</PageTitle>
      <Row className="flex-row-reverse">
        <Col md="auto">
          <Nav className={cns("flex-column", styles.connectedList)}>
            <NavDrawerSkeleton>Verifica residenza USA</NavDrawerSkeleton>
            <NavDrawerSkeleton>Dati contraente</NavDrawerSkeleton>
            <NavDrawerSkeleton>Questionario di adeguatezza</NavDrawerSkeleton>
            <NavDrawerSkeleton>Preventivo</NavDrawerSkeleton>
            <NavDrawerSkeleton>
              Questionario sanitario / non sanitario
            </NavDrawerSkeleton>
            <NavDrawerSkeleton>Assicurato</NavDrawerSkeleton>
            <NavDrawerSkeleton>Beneficiari</NavDrawerSkeleton>
          </Nav>
        </Col>
        <Col className="d-flex flex-column gap-3">
          <Alert variant="info">
            <h3>
              <FontAwesomeIcon icon={faTriangleExclamation} className="me-2" />
              Avviso Legale: Contraente e Assicurato devono Coincidere
            </h3>
            <p>
              Ti diamo il benvenuto nell'App di Calcolo Preventivo per Polizze
              Vita. Ai fini legali, è obbligatorio che il contraente coincida
              con l'assicurato durante la compilazione dei dati.
            </p>
            <p className="mb-0">
              Il contraente è la persona responsabile della sottoscrizione della
              polizza, mentre l'assicurato è la persona per la quale la polizza
              viene stipulata. Affinché il processo sia conforme alle normative
              vigenti, i dettagli del contraente e dell'assicurato devono
              corrispondere.
            </p>
          </Alert>
          <DrawerSkeleton title="Verifica residenza USA" />
          <DrawerSkeleton title="Dati contraente" />
          <DrawerSkeleton title="Questionario di adeguatezza" />
          <DrawerSkeleton title="Preventivo" />
          <DrawerSkeleton title="Questionario sanitario / non sanitario" />
          <DrawerSkeleton title="Assicurato" />
          <DrawerSkeleton title="Beneficiari" />
        </Col>
      </Row>
    </AppContainer>
  );
}
