import {Card, CardBody, Col, Table} from "react-bootstrap";

export function Advantages() {
  return (
    <Col>
      <Card className="overflow-hidden">
        <Table className="mb-0">
          <thead>
            <tr>
              <th>
                <h3 className="mb-0">I vantaggi</h3>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Rimborso dei premi a scadenza</td>
              <td>100%</td>
            </tr>
            <tr>
              <td>Rimborso dei premi al 25° anno</td>
              <td>90%</td>
            </tr>
            <tr>
              <td>Rimborso dei premi al 20° anno</td>
              <td>75%</td>
            </tr>
            <tr>
              <td>Rimborso dei premi al 15° anno</td>
              <td>50%</td>
            </tr>
            <tr style={{borderBottom: "transparent"}}>
              <td>Detrazione fiscale</td>
              <td>fino al 19%</td>
            </tr>
          </tbody>
        </Table>
      </Card>
    </Col>
  );
}
