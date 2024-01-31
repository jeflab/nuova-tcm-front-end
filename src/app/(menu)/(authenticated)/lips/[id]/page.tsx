import {DebugState} from "@/app/(menu)/(authenticated)/lips/[id]/DebugState";
import {drawers} from "@/app/(menu)/(authenticated)/lips/[id]/drawers";
import {Lip} from "@/app/(menu)/(authenticated)/lips/model";
import {cns} from "@/helpers/cns";
import {AppContainer} from "@/ui/AppContainer";
import {Drawer} from "@/ui/drawer/Drawer";
import {NavDrawer} from "@/ui/drawer/NavDrawer";
import {PageTitle} from "@/ui/PageTitle";
import {faTriangleExclamation} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Alert, Col, Nav, Row} from "react-bootstrap";
import styles from "./page.module.scss";

// TODO: abbassare il fetch dei dati, o in un sotto-componente client o addirittura nel drawer (fetch è cachata)
//  Fatto ciò la pagina può tornare server component

export default async function NewLipPage() {
  const updateLip = async (data: Partial<Lip>) => {
    console.log("Update LIP", data);
  };

  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>Nuova polizza</PageTitle>
      <Row className="flex-row-reverse">
        <Col md="auto">
          <Nav className={cns("flex-column", styles.connectedList)}>
            {drawers.map(({name, title}) => (
              <NavDrawer name={name} key={name}>
                {title}
              </NavDrawer>
            ))}
          </Nav>
        </Col>
        <Col className="d-flex flex-column gap-3">
          <Alert variant="info" className="mb-0">
            <h3>
              <FontAwesomeIcon icon={faTriangleExclamation} className="me-2" />
              Avviso legale: contraente e assicurato devono coincidere.
            </h3>
            <p>
              Ti diamo il benvenuto nell'app di calcolo preventivo per polizze
              vita. Ai fini legali, è obbligatorio che il contraente coincida
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
          {/*<DebugState />*/}
          {drawers.map(({name, title, modalContent, summaryContent}) => (
            <Drawer
              key={name}
              name={name}
              title={title}
              modalContent={modalContent}
            >
              {summaryContent}
            </Drawer>
          ))}
        </Col>
      </Row>
    </AppContainer>
  );
}
