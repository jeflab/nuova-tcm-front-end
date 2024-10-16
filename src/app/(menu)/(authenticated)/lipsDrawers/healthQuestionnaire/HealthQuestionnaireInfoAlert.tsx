import {CSSProperties} from "react";
import {Alert, Table} from "react-bootstrap";

const tableBgTransparent = {"--bs-table-bg": "transparent"} as CSSProperties;

export function HealthQuestionnaireInfoAlert() {
  return (
    <Alert variant="info">
      <p>
        Gentile Contraente,
        <br />
        per la corretta compilazione del questionario sullo stato di salute si
        comunica che la <strong>Legge n. 193 del 7.12.2023</strong> (di seguito
        la “Legge”) ha introdotto il “
        <strong>diritto all’oblio oncologico</strong>”.
      </p>
      <p>
        In sede di stipula o rinnovo dei contratti di assicurazione non è
        ammesso chiedere informazioni sul precedente stato di salute
        dell’Assicurando/Assicurato che in passato sia stato affetto da
        patologie oncologiche per le quali sia considerato guarito.
      </p>
      <p>
        Secondo la Legge,{" "}
        <u>si considera guarita da una patologia oncologica la persona che</u>,
        alla data della richiesta di informazioni sul suo stato di salute,{" "}
        <u>
          abbia concluso da più di dieci anni il trattamento attivo, senza
          episodi di recidiva.
        </u>
      </p>
      <p>
        Tale periodo è ridotto a cinque anni se la patologia oncologica sia
        insorta prima del ventunesimo anno di età.
      </p>
      <p>
        Inoltre, il Decreto del Ministero della Salute del 22.03.2024 ha
        stabilito ulteriori termini ridotti per il maturarsi dell'oblio
        oncologico rispetto al limite dei dieci anni (o cinque se diagnosi
        precedente al compimento del 21° anno di età) dalla fine del trattamento
        o dall'ultimo intervento chirurgico come da tabella seguente:
      </p>
      <Table size="sm" style={tableBgTransparent}>
        <thead>
          <tr>
            <th>Tipo di tumore</th>
            <th>Specificazioni</th>
            <th>Anni dalla fine del trattamento</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Colon-retto</td>
            <td>Stadio I, qualsiasi età</td>
            <td>1</td>
          </tr>
          <tr>
            <td>Colon-retto</td>
            <td>Stadio II-III, &gt; 21 anni</td>
            <td>7</td>
          </tr>
          <tr>
            <td>Melanoma</td>
            <td>&gt; 21 anni</td>
            <td>6</td>
          </tr>
          <tr>
            <td>Mammella</td>
            <td>Stadio I - II, qualsiasi età</td>
            <td>1</td>
          </tr>
          <tr>
            <td>Utero, collo</td>
            <td>&gt; 21 anni</td>
            <td>6</td>
          </tr>
          <tr>
            <td>Utero, corpo</td>
            <td>Qualsiasi età</td>
            <td>5</td>
          </tr>
          <tr>
            <td>Testicolo</td>
            <td>Qualsiasi età</td>
            <td>1</td>
          </tr>
          <tr>
            <td>Tiroide</td>
            <td>
              Donne con diagnosi &lt; 55 anni - Uomini con diagnosi &lt; 45
              anni. Esclusi i tumori anaplastici per entrambi i sessi
            </td>
            <td>1</td>
          </tr>
          <tr>
            <td>Linfomi di Hodgkin</td>
            <td>&lt; 45 anni</td>
            <td>5</td>
          </tr>
          <tr>
            <td>Leucemie</td>
            <td>Acute (linfoblastiche e mieloidi) qualsiasi età</td>
            <td>5</td>
          </tr>
        </tbody>
      </Table>
      <p>
        Di conseguenza, chi è stato affetto da una patologia oncologica e ha
        concluso il trattamento attivo da più di 10 anni, ovvero 5 anni se la
        patologia è insorta prima del 21° anno di età, ovvero -a seconda del
        tipo di patologia- nel termine più breve riportato nella tabella di cui
        sopra, senza episodi di recidiva, secondo la Legge non è tenuto a
        fornire alcuna informazione relativa alla precedente patologia
        oncologica.
      </p>
      <p>
        In ogni caso, qualora le informazioni relative ai casi previsti dalla
        Legge venissero erroneamente riportate dall’Assicurando/Assicurato
        durante la fase assuntiva o fossero state fornite precedentemente, le
        stesse non potranno e non dovranno essere utilizzate dalla Compagnia per
        la determinazione delle condizioni contrattuali.
      </p>
    </Alert>
  );
}
