import {getCoverageDuration} from "@/app/(menu)/quoter/helpers";
import {toCurrency} from "@/helpers/numbers";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {FieldError} from "@/ui/form/FieldError";
import {HelpText} from "@/ui/form/HelpText";
import {InputField} from "@/ui/form/InputField";
import {Col, FormGroup, FormLabel, InputGroup} from "react-bootstrap";
import {useFormContext} from "react-hook-form";

export function Coverages() {
  const {watch} = useFormContext();

  return (
    <>
      <Col className="vstack gap-3">
        <h3>Coperture assicurative</h3>
        <FormGroup controlId="death" as={BorderFeedback}>
          <p className="mb-2 input-heading">Caso morte</p>
          <HelpText hideOnError="min" id="death-help-text">
            Il capitale assicurato deve essere maggiore o uguale a 20 000,00 €
          </HelpText>
          <strong>
            Durata: {getCoverageDuration(watch("birthDate"))} anni
          </strong>
          <FieldError />
          <div className="d-flex flex-column flex-md-row align-items-md-center column-gap-3 row-gap-1">
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
        </FormGroup>
      </Col>
    </>
  );
}
