import {getCoverageDuration} from "@/app/(menu)/(authenticated)/quoter/helpers";
import {toCurrency} from "@/helpers/numbers";
import {Currency} from "@/ui/Currency";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {FieldError} from "@/ui/form/FieldError";
import {HelpText} from "@/ui/form/HelpText";
import {InputField} from "@/ui/form/InputField";
import {Col, FormGroup, FormLabel, InputGroup} from "react-bootstrap";
import {useFormContext} from "react-hook-form";

export function Coverages() {
  const {watch, setValue} = useFormContext();

  return (
    <>
      <Col className="vstack gap-3">
        <h3>Coperture assicurative</h3>
        <FormGroup controlId="death" as={BorderFeedback}>
          <p className="mb-2 input-heading">Caso mortee</p>
          <HelpText hideOnError="min" id="death-help-text">
            Il capitale assicurato deve essere maggiore o uguale a{" "}
            <Currency>{20_000}</Currency> e minore o uguale a{" "}
            <Currency>{300_000}</Currency>
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
                onChange={(event) => {
                  const value = parseInt(event.target.value, 10);
                  if (value < 24_000) {
                    setValue("tpd.enabled", false, {shouldValidate: true});
                    setValue("tpd.coverage", "", {shouldValidate: true});
                  }
                }}
                aria-describedby="death-help-text"
                min={20_000}
                max={300_000}
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
                  max: {
                    value: 300_000,
                    message: `Il capitale assicurato deve essere minore o uguale a ${toCurrency(
                      300_000,
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
