import {Lip} from "@/entities/lip";
import {cns} from "@/helpers/cns";
import {AppContainer} from "@/ui/AppContainer";
import {Drawer} from "@/ui/drawer/Drawer";
import {NavDrawer} from "@/ui/drawer/NavDrawer";
import {PageTitle} from "@/ui/PageTitle";
import {faTriangleExclamation} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {notFound} from "next/navigation";
import {Alert, Col, Nav, Row} from "react-bootstrap";
import {getLip} from "./actions";
import {drawers} from "./drawers";
import {InitStoreWithServerData} from "./InitStoreWithServerData";
import styles from "./page.module.scss";

// TODO: abbassare il fetch dei dati, o in un sotto-componente client o addirittura nel drawer (fetch è cachata)
//  Fatto ciò la pagina può tornare server component

interface NewLipPageProps {
  params: {id: string};
}

const minWidthHack = {minWidth: "1px"};

export default async function NewLipPage({params}: NewLipPageProps) {
  let lip: Lip | undefined = undefined;
  if (params.id !== "new" && params.id !== "debug") {
    const lipResponse = await getLip(parseInt(params.id, 10));
    if (lipResponse.status === "failed") {
      if (lipResponse.responseStatus === 404) {
        notFound();
      }
      throw new Error(lipResponse.message);
    }
    lip = lipResponse.lip;
  }

  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>
        {lip?.lipNumber ? `Polizza n° ${lip?.lipNumber}` : "Nuova polizza"}
      </PageTitle>
      <InitStoreWithServerData lip={lip} />
      <Row className="flex-row-reverse">
        <Col md="auto">
          <Nav className={cns("flex-column", styles.connectedList)}>
            {drawers.map(({name, title, shortTitle}) => (
              <NavDrawer name={name} key={name}>
                {shortTitle ?? title}
              </NavDrawer>
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
