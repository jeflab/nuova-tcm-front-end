import {toCurrency} from "@/helpers/numbers";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {FieldError} from "@/ui/form/FieldError";
import {HelpText} from "@/ui/form/HelpText";
import {InputField} from "@/ui/form/InputField";
import {Col, FormGroup, FormLabel, InputGroup} from "react-bootstrap";

export function Coverages() {
  return (
    <div>
      <h3>Coperture assicurative</h3>
      <Col xs="auto">
        <FormGroup controlId="death">
          <BorderFeedback>
            <div className="d-sm-flex align-items-sm-center column-gap-sm-3">
              <FormLabel className="text-nowrap mb-sm-0">
                Capitale assicurato
              </FormLabel>
              <InputGroup className="flex-grow-0">
                <InputField
                  aria-describedby="death-help-text"
                  min={20_000}
                  placeholder="Capitale assicurato"
                  step={1_000}
                  type="number"
                  validation={{
                    required: "Inserisci l'importo del capitale assicurato",
                    min: {
                      value: 20_000,
                      message: `Il capitale assicurato deve essere maggiore o uguale a ${toCurrency(
                        20_000,
                      )}`,
                    },
                    validate: (value) => {
                      if (value % 1_000 !== 0) {
                        return `Il capitale assicurato deve essere multiplo di ${toCurrency(
                          1_000,
                        )}`;
                      }
                    },
                  }}
                />
                <InputGroup.Text>,00 €</InputGroup.Text>
              </InputGroup>
            </div>
            <HelpText hideOnError="min" id="death-help-text">
              Il capitale assicurato deve essere maggiore o uguale a 20 000,00 €
            </HelpText>
            <FieldError />
            <strong>Durata: 30 anni</strong>
          </BorderFeedback>
        </FormGroup>
      </Col>
    </div>
  );
}
