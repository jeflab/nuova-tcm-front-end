import {cns} from "@/helpers/cns";
import {Currency} from "@/ui/Currency";
import {faInfoCircle} from "@fortawesome/pro-duotone-svg-icons";
import {faAsterisk} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Card, Col, OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import styles from "./Advantages.module.scss";

interface AdvantagesProps {
  duration: number;
  premium: number;
  showTitle?: boolean;
}

export function Advantages({
  duration,
  premium,
  showTitle = true,
}: AdvantagesProps) {
  return (
    <Col>
      <Card className="overflow-hidden">
        {showTitle && <h3 className="mb-0 p-2 border-bottom">I vantaggi</h3>}
        <Table size="small" className={cns(["mb-0", styles.table])}>
          <tbody>
            <tr className={cns(duration < 30 && "d-none")}>
              <td>Bonus a scadenza</td>
              <td>100%</td>
              <td>Importo</td>
              <td>{premium ? <Currency>{30 * premium}</Currency> : "? €"}</td>
            </tr>
            <tr className={cns(duration < 25 && "d-none")}>
              <td>Bonus dal 25° al 29° anno</td>
              <td>90%</td>
              <td>Importo minimo garantito</td>
              <td>
                {premium ? <Currency>{25 * premium * 0.9}</Currency> : "? €"}
              </td>
            </tr>
            <tr className={cns(duration < 20 && "d-none")}>
              <td>Bonus dal 20° al 24° anno</td>
              <td>75%</td>
              <td>Importo minimo garantito</td>
              <td>
                {premium ? <Currency>{20 * premium * 0.75}</Currency> : "? €"}
              </td>
            </tr>
            <tr className={cns(duration < 15 && "d-none")}>
              <td>Bonus dal 15° al 19° anno</td>
              <td>50%</td>
              <td>Importo minimo garantito</td>
              <td>
                {premium ? <Currency>{15 * premium * 0.5}</Currency> : "? €"}
              </td>
            </tr>
            <tr style={{borderBottom: "transparent"}}>
              <td>
                Rata mensile
                <br />
                <small>Detraibile fino al 19% a norma di legge</small>{" "}
                <OverlayTrigger
                  overlay={
                    <Tooltip id="advantages-info">
                      La cifra mostrata è una stima indicativa. Chiediamo di
                      rivolgervi al vostro consulente fiscale o commercialista
                      di fiducia per ottenere la cifra esatta
                    </Tooltip>
                  }
                >
                  <FontAwesomeIcon icon={faAsterisk} className="text-primary" />
                </OverlayTrigger>
              </td>
              <td>19%</td>
              <td>Importo</td>
              <td>
                {premium ? (
                  <Currency>{Math.min(101, premium * 0.19)}</Currency>
                ) : (
                  "? €"
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </Col>
  );
}
