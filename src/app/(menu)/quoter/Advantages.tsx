import {cns} from "@/helpers/cns";
import {toCurrency, toDecimal, toPercent} from "@/helpers/numbers";
import {Card, Col, Table} from "react-bootstrap";
import styles from "./Advantages.module.scss";

interface AdvantagesProps {
  premium: number;
}

export function Advantages({premium}: AdvantagesProps) {
  return (
    <Col>
      <Card className="overflow-hidden">
        <Table size="small" className={cns(["mb-0", styles.table])}>
          <thead>
            <tr>
              <th colSpan={4}>
                <h3 className="mb-0">Bonus garantiti</h3>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Bonus a scadenza</td>
              <td>100%</td>
              <td>Importo</td>
              <td>{toCurrency(10_000)}</td>
            </tr>
            <tr>
              <td>Bonus dal 25° al 29° anno</td>
              <td>90%</td>
              <td>Importo minimo garantito</td>
              <td>{toCurrency(9_000)}</td>
            </tr>
            <tr>
              <td>Bonus dal 20° al 24° anno</td>
              <td>75%</td>
              <td>Importo minimo garantito</td>
              <td>{toCurrency(6_750)}</td>
            </tr>
            <tr>
              <td>Bonus dal 15° al 19° anno</td>
              <td>50%</td>
              <td>Importo minimo garantito</td>
              <td>{toCurrency(3_375)}</td>
            </tr>
            <tr>
              <td>Detrazione fiscale</td>
              <td>19%</td>
              <td>Importo</td>
              <td>{toCurrency(Math.min(101, premium * 0.19))}</td>
            </tr>
            <tr style={{borderBottom: "transparent"}}>
              <td></td>
              <td></td>
              <td>Percentuale</td>
              <td>
                {toPercent(
                  premium > 0 ? Math.min(101, premium * 0.19) / premium : 0,
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </Col>
  );
}
