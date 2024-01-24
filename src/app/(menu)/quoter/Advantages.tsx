import {cns} from "@/helpers/cns";
import {Card, Col, Table} from "react-bootstrap";
import styles from "./Advantages.module.scss";
import {Currency, Percent} from "@/ui/Currency";

interface AdvantagesProps {
  duration: number;
  premium: number;
}

export function Advantages({duration, premium}: AdvantagesProps) {
  return (
    <Col>
      <Card className="overflow-hidden">
        <h3 className="mb-0 p-2 border-bottom">I vantaggi</h3>
        <Table size="small" className={cns(["mb-0", styles.table])}>
          <tbody>
            <tr className={cns(duration < 30 && "d-none")}>
              <td>Bonus a scadenza</td>
              <td>100%</td>
              <td>Importo</td>
              <td>
                {premium ? <Currency>{duration * premium}</Currency> : "? €"}
              </td>
            </tr>
            <tr className={cns(duration < 25 && "d-none")}>
              <td>Bonus dal 25° al 29° anno</td>
              <td>90%</td>
              <td>Importo minimo garantito</td>
              <td>
                {premium ? (
                  <Currency>{duration * premium * 0.9}</Currency>
                ) : (
                  "? €"
                )}
              </td>
            </tr>
            <tr className={cns(duration < 20 && "d-none")}>
              <td>Bonus dal 20° al 24° anno</td>
              <td>75%</td>
              <td>Importo minimo garantito</td>
              <td>
                {premium ? (
                  <Currency>{duration * premium * 0.75}</Currency>
                ) : (
                  "? €"
                )}
              </td>
            </tr>
            <tr className={cns(duration < 15 && "d-none")}>
              <td>Bonus dal 15° al 19° anno</td>
              <td>50%</td>
              <td>Importo minimo garantito</td>
              <td>
                {premium ? (
                  <Currency>{duration * premium * 0.5}</Currency>
                ) : (
                  "? €"
                )}
              </td>
            </tr>
            <tr>
              <td>Detrazione fiscale</td>
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
            <tr style={{borderBottom: "transparent"}}>
              <td></td>
              <td></td>
              <td>Percentuale</td>
              <td>
                {premium ? (
                  <Percent>{Math.min(101, premium * 0.19) / premium}</Percent>
                ) : (
                  "? %"
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </Col>
  );
}
