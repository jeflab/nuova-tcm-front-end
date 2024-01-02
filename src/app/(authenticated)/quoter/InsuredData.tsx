import {dbDateString} from "@/helpers/dates";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {FieldError} from "@/ui/form/FieldError";
import {HelpText} from "@/ui/form/HelpText";
import {InputField} from "@/ui/form/InputField";
import {subYears} from "date-fns/subYears";
import {Col, FormGroup, FormLabel, FormText, Row} from "react-bootstrap";

export function InsuredData() {
  return (
    <div>
      <h3>Dati dell'assicurato</h3>
      <Row xs={1} sm={3} className="row-gap-3">
        <Col>
          <FormGroup controlId="birthDate">
            <BorderFeedback>
              <FormLabel>Data di nascita</FormLabel>
              <InputField
                type="date"
                placeholder="Data di nascita"
                validation={{
                  required: "Inserisci la data di nascita dell'assicurato",
                  max: {
                    value: dbDateString(subYears(Date(), 18)),
                    message: "L'assicurato deve avere almeno 18 anni",
                  },
                  min: {
                    value: dbDateString(subYears(Date(), 75)),
                    message: "L'assicurato deve avere al massimo 75 anni",
                  },
                }}
              />
              <HelpText>
                L'età dell'assicurato deve essere compresa tra 18 e 75 anni
              </HelpText>
              <FieldError />
            </BorderFeedback>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup controlId="gender">
            <BorderFeedback>
              <p className="mb-2">Genere</p>
              <CheckGroup
                type="radio"
                inline
                options={[
                  {label: "Maschio", value: "male"},
                  {label: "Femmina", value: "female"},
                  {label: "Altro", value: "other"},
                ]}
                validation={{
                  required: "Seleziona il genere dell'assicurato",
                }}
              />
              <FieldError />
            </BorderFeedback>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup controlId="smoker">
            <BorderFeedback>
              <p className="mb-2">Fumatore</p>
              <CheckGroup
                type="radio"
                inline
                options={[
                  {label: "Sì", value: "true"},
                  {label: "No", value: "false"},
                ]}
                validation={{
                  required: "Seleziona un'opzione",
                }}
              />
              <HelpText>
                L'assicurato ha fumato (sigarette, sigari, pipa o altro) negli
                ultimi 24 mesi, oppure ha smesso di fumare su consiglio medico?
              </HelpText>
              <FieldError />
            </BorderFeedback>
          </FormGroup>
        </Col>
      </Row>
    </div>
  );
}
