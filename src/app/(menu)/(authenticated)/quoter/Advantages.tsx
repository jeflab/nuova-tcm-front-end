import {cns} from "@/helpers/cns";
import {Currency} from "@/ui/Currency";
import {faAsterisk} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Card, Col, OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import styles from "./Advantages.module.scss";
import {BonusConfig, defaultBonusConfig} from "./bonus";

interface AdvantagesProps {
  duration: number;
  premium: number;
  showTitle?: boolean;
  bonusConfig?: BonusConfig;
}

export function Advantages({
  duration,
  premium,
  showTitle = true,
  bonusConfig = defaultBonusConfig,
}: AdvantagesProps) {
  return (
    <Col>
      <Card className="overflow-hidden">
        {showTitle && <h3 className="mb-0 p-2 border-bottom">I vantaggi</h3>}
        <Table size="small" className={cns(["mb-0", styles.table])}>
          <tbody>
            {bonusConfig.bonuses.map((bonus, index) => (
              <tr
                key={index}
                className={cns(duration < bonus.minDuration && "d-none")}
              >
                <td>{bonus.label}</td>
                <td>{bonus.percentage}%</td>
                <td>{bonus.amountLabel}</td>
                <td>
                  {premium ? (
                    <Currency>
                      {bonus.minDuration * premium * (bonus.percentage / 100)}
                    </Currency>
                  ) : (
                    <span className="text-nowrap">? €</span>
                  )}
                </td>
              </tr>
            ))}
            <tr style={{borderBottom: "transparent"}}>
              <td>
                Premio
                <br />
                <small>
                  Detraibile fino al {bonusConfig.detraction.percentage}% a
                  norma di legge
                </small>{" "}
                <OverlayTrigger
                  overlay={
                    <Tooltip id="advantages-info">
                      La cifra mostrata è una stima indicativa. Chiediamo di
                      rivolgervi al vostro Consulente fiscale o commercialista
                      di fiducia per ottenere la cifra esatta
                    </Tooltip>
                  }
                >
                  <FontAwesomeIcon icon={faAsterisk} className="text-primary" />
                </OverlayTrigger>
              </td>
              <td>{bonusConfig.detraction.percentage}%</td>
              <td>Importo</td>
              <td>
                {premium ? (
                  <Currency>
                    {Math.min(
                      bonusConfig.detraction.maxAmount,
                      premium * (bonusConfig.detraction.percentage / 100),
                    )}
                  </Currency>
                ) : (
                  <span className="text-nowrap">? €</span>
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </Col>
  );
}
