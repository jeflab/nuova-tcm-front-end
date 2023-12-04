import {AppContainer} from "@/ui/AppContainer";
import {PageTitle} from "@/ui/PageTitle";
import {faCircle, faCirclePlay} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button, Card, CardHeader} from "react-bootstrap";

export default async function NewLipPage() {
  return (
    <AppContainer className="vstack gap-3">
      <PageTitle>Nuova polizza</PageTitle>
      <Card>
        <CardHeader className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0">
            <FontAwesomeIcon icon={faCirclePlay} className="text-primary" />{" "}
            Questionario di adeguatezza
          </h5>
          <Button variant="primary">Apri</Button>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0">
            <FontAwesomeIcon icon={faCircle} /> Preventivo
          </h5>
          <Button variant="primary" className="invisible">
            Apri
          </Button>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0">
            <FontAwesomeIcon icon={faCircle} /> Questionario sanitario / non
            sanitario
          </h5>
          <Button variant="primary" className="invisible">
            Apri
          </Button>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0">
            <FontAwesomeIcon icon={faCircle} /> Contraente
          </h5>
          <Button variant="primary" className="invisible">
            Apri
          </Button>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0">
            <FontAwesomeIcon icon={faCircle} /> Assicurato
          </h5>
          <Button variant="primary" className="invisible">
            Apri
          </Button>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="d-flex align-items-center justify-content-between">
          <h5 className="mb-0">
            <FontAwesomeIcon icon={faCircle} /> Beneficiari
          </h5>
          <Button variant="primary" className="invisible">
            Apri
          </Button>
        </CardHeader>
      </Card>
    </AppContainer>
  );
}
