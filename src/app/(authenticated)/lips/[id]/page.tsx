import {ContractorForm} from "@/app/(authenticated)/lips/[id]/ContractorForm";
import {Lip} from "@/app/(authenticated)/lips/model";
import {cns} from "@/helpers/cns";
import {AppContainer} from "@/ui/AppContainer";
import {Drawer} from "@/ui/drawer/Drawer";
import {PageTitle} from "@/ui/PageTitle";
import {Col, Nav, NavLink, Row} from "react-bootstrap";
import styles from "./page.module.scss";
import {DrawerIcon} from "@/ui/drawer/DrawerIcon";

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
            <NavLink>
              <DrawerIcon isActive className="me-2" />
              Dati contraente
            </NavLink>
            <NavLink disabled>
              <DrawerIcon className="me-2" />
              Questionario di adeguatezza
            </NavLink>
            <NavLink disabled>
              <DrawerIcon className="me-2" />
              Preventivo
            </NavLink>
            <NavLink disabled>
              <DrawerIcon className="me-2" />
              Questionario sanitario / non sanitario
            </NavLink>
            <NavLink disabled>
              <DrawerIcon className="me-2" />
              Contraente
            </NavLink>
            <NavLink disabled>
              <DrawerIcon className="me-2" />
              Assicurato
            </NavLink>
            <NavLink disabled>
              <DrawerIcon className="me-2" />
              Beneficiari
            </NavLink>
          </Nav>
        </Col>
        <Col className="d-flex flex-column gap-3">
          <Drawer
            title="Dati contraente"
            isActive
            modalContent={<ContractorForm />}
          ></Drawer>
          <Drawer title="Questionario di adeguatezza"></Drawer>
          <Drawer title="Preventivo"></Drawer>
          <Drawer title="Questionario sanitario / non sanitario"></Drawer>
          <Drawer title="Contraente"></Drawer>
          <Drawer title="Assicurato"></Drawer>
          <Drawer title="Beneficiari"></Drawer>
        </Col>
      </Row>
    </AppContainer>
  );
}
