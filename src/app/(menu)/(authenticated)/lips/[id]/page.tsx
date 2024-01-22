import {ContractorForm} from "@/app/(menu)/(authenticated)/lips/[id]/ContractorForm";
import {DebugState} from "@/app/(menu)/(authenticated)/lips/[id]/DebugState";
import {FatcaForm} from "@/app/(menu)/(authenticated)/lips/[id]/FatcaForm";
import {FatcaRecap} from "@/app/(menu)/(authenticated)/lips/[id]/FatcaSummary";
import {Lip} from "@/app/(menu)/(authenticated)/lips/model";
import {cns} from "@/helpers/cns";
import {AppContainer} from "@/ui/AppContainer";
import {Drawer} from "@/ui/drawer/Drawer";
import {NavDrawer} from "@/ui/drawer/NavDrawer";
import {PageTitle} from "@/ui/PageTitle";
import {faTriangleExclamation} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import React from "react";
import {Alert, Col, Nav, NavLink, Row} from "react-bootstrap";
import styles from "./page.module.scss";

export type DrawerName =
  | "fatca"
  | "contractorFiscalCode"
  | "contractorPersonalAreaActivation"
  | "adequacy"
  | "quote"
  | "health"
  | "insured"
  | "beneficiaries";

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
            <NavDrawer name="fatca">Verifica residenza USA</NavDrawer>
            <NavDrawer name="contractorFiscalCode">Dati contraente</NavDrawer>
            <NavDrawer name="contractorPersonalAreaActivation">
              Attivazione area contraente
            </NavDrawer>
            <NavDrawer name="adequacy">Questionario di adeguatezza</NavDrawer>
            <NavDrawer name="quote">Preventivo</NavDrawer>
            <NavDrawer name="health">
              Questionario sanitario / non sanitario
            </NavDrawer>
            <NavDrawer name="insured">Assicurato</NavDrawer>
            <NavDrawer name="beneficiaries">Beneficiari</NavDrawer>
          </Nav>
          <DebugState />
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
          <Drawer
            name="fatca"
            title="Verifica residenza USA"
            modalContent={<FatcaForm />}
          >
            <FatcaRecap />
          </Drawer>
          <Drawer
            name="contractorFiscalCode"
            title="Dati contraente"
            modalContent={<ContractorForm />}
          ></Drawer>
          <Drawer
            name="contractorPersonalAreaActivation"
            title="Attivazione area contraente"
          ></Drawer>
          <Drawer name="adequacy" title="Questionario di adeguatezza"></Drawer>
          <Drawer name="quote" title="Preventivo"></Drawer>
          <Drawer
            name="health"
            title="Questionario sanitario / non sanitario"
          ></Drawer>
          <Drawer name="insured" title="Assicurato"></Drawer>
          <Drawer name="beneficiaries" title="Beneficiari"></Drawer>
        </Col>
      </Row>
    </AppContainer>
  );
}
