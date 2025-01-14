import {cns} from "@/helpers/cns";
import {normalizeError} from "@/helpers/errors";
import {Lip} from "@/models/entities/lip";
import {AppContainer} from "@/ui/AppContainer";
import {ButtonLink} from "@/ui/ButtonLink";
import {Drawer} from "@/ui/drawer/Drawer";
import {NavDrawer} from "@/ui/drawer/NavDrawer";
import {LipStateBadge} from "@/ui/LipStateBadge";
import {PageTitle} from "@/ui/PageTitle";
import ScrollReveal from "@/ui/ScrollReveal/ScrollReveal";
import {faArrowLeft} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {notFound} from "next/navigation";
import {Fragment} from "react";
import {Col, Nav, Row} from "react-bootstrap";
import {getLip} from "./actions";
import {drawers} from "./drawers";
import {InitStoreWithServerData} from "./InitStoreWithServerData";
import styles from "./page.module.scss";

// TODO: abbassare il fetch dei dati, o in un sotto-componente client o addirittura nel drawer (fetch è cachata)
//  Fatto ciò la pagina può tornare server component

interface NewLipPageProps {
  params: Promise<{id: string}>;
}

const minWidthHack = {minWidth: "1px"};

export default async function NewLipPage(props: NewLipPageProps) {
  const params = await props.params;
  let lip: Lip | null = null;
  if (params.id !== "new") {
    const lipResponse = await getLip(parseInt(params.id, 10));
    if (lipResponse?.status !== "success") {
      if (lipResponse?.responseStatus === 404) {
        notFound();
      }
      throw normalizeError(lipResponse);
    }
    lip = lipResponse.lip;
  }

  return (
    <AppContainer className="vstack gap-3 align-items-start">
      <InitStoreWithServerData lip={lip} />
      <div>
        <PageTitle>
          {lip?.lipNumber
            ? `Polizza n° ${lip?.lipNumber}`
            : "Nuova proposta di polizza"}
        </PageTitle>
        {lip && lip?.lipStates && <LipStateBadge lipState={lip.lipStates} />}
      </div>
      <ButtonLink href="/lips">
        <FontAwesomeIcon icon={faArrowLeft} /> Torna all'elenco
      </ButtonLink>
      <Row className="flex-row-reverse gy-3">
        <Col md="auto">
          <Nav className={cns("flex-column", styles.connectedList)}>
            <ScrollReveal revealThreshold={70}>
              <div className="mb-3 pb-2 border-bottom">
                <PageTitle>
                  {lip?.lipNumber ? (
                    <>
                      Polizza n°
                      <br />
                      {lip?.lipNumber}
                    </>
                  ) : (
                    <>
                      Nuova proposta
                      <br />
                      di polizza
                    </>
                  )}
                </PageTitle>
                {lip && lip?.lipStates && (
                  <LipStateBadge lipState={lip.lipStates} />
                )}
              </div>
            </ScrollReveal>
            <div className={styles.navLinks}>
              {drawers.map(({name, title, shortTitle, isVisible}) => {
                if (isVisible && lip && !isVisible(lip.type)) {
                  return null;
                }
                return (
                  <NavDrawer name={name} key={name}>
                    {shortTitle ?? title}
                  </NavDrawer>
                );
              })}
            </div>
          </Nav>
        </Col>
        <Col className="d-flex flex-column gap-3" style={minWidthHack}>
          {drawers.map(
            ({name, title, modalContent, summaryContent, lock, isVisible}) => {
              if (isVisible && lip && !isVisible(lip.type)) {
                return null;
              }
              return (
                <Fragment key={name}>
                  {lock}
                  <Drawer name={name} title={title} modalContent={modalContent}>
                    {summaryContent}
                  </Drawer>
                </Fragment>
              );
            },
          )}
        </Col>
      </Row>
    </AppContainer>
  );
}
