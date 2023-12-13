import styles from "@/app/(authenticated)/lips/[id]/page.module.scss";
import {cns} from "@/app/helpers/cns";
import {AppContainer} from "@/ui/AppContainer";
import {DrawerSkeleton} from "@/ui/drawer/Drawer";
import {DrawerIcon} from "@/ui/drawer/DrawerIcon";
import {PageTitle} from "@/ui/PageTitle";
import {Col, Nav, NavLink, Row} from "react-bootstrap";

export default async function NewLipPage() {
  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>Nuova polizza</PageTitle>
      <Row className="flex-row-reverse">
        <Col md="auto">
          <Nav className={cns("flex-column", styles.connectedList)}>
            <NavLink disabled>
              <DrawerIcon isLoading className="me-2" />
              Dati contraente
            </NavLink>
            <NavLink disabled>
              <DrawerIcon isLoading className="me-2" />
              Questionario di adeguatezza
            </NavLink>
            <NavLink disabled>
              <DrawerIcon isLoading className="me-2" />
              Preventivo
            </NavLink>
            <NavLink disabled>
              <DrawerIcon isLoading className="me-2" />
              Questionario sanitario / non sanitario
            </NavLink>
            <NavLink disabled>
              <DrawerIcon isLoading className="me-2" />
              Contraente
            </NavLink>
            <NavLink disabled>
              <DrawerIcon isLoading className="me-2" />
              Assicurato
            </NavLink>
            <NavLink disabled>
              <DrawerIcon isLoading className="me-2" />
              Beneficiari
            </NavLink>
          </Nav>
        </Col>
        <Col className="d-flex flex-column gap-3">
          <DrawerSkeleton title="Dati contraente"></DrawerSkeleton>
          <DrawerSkeleton title="Questionario di adeguatezza"></DrawerSkeleton>
          <DrawerSkeleton title="Preventivo"></DrawerSkeleton>
          <DrawerSkeleton title="Questionario sanitario / non sanitario"></DrawerSkeleton>
          <DrawerSkeleton title="Contraente"></DrawerSkeleton>
          <DrawerSkeleton title="Assicurato"></DrawerSkeleton>
          <DrawerSkeleton title="Beneficiari"></DrawerSkeleton>
        </Col>
      </Row>
    </AppContainer>
  );
}
