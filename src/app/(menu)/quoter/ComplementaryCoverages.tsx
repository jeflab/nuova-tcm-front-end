import {toCurrency} from "@/helpers/numbers";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckboxField} from "@/ui/form/CheckboxField";
import {FieldError} from "@/ui/form/FieldError";
import {HelpText} from "@/ui/form/HelpText";
import {InputField} from "@/ui/form/InputField";
import {Col, FormGroup, FormLabel, Row} from "react-bootstrap";
import {useFormContext} from "react-hook-form";

export function ComplementaryCoverages() {
  const {trigger, watch} = useFormContext();
  const deathValue = watch("death");

  return (
    <>
      <h4>
        <em>Coperture complementari</em>
      </h4>
      <Row xs={1} sm={2} className="row-gap-3">
        <Col>
          <FormGroup controlId="accidentalDeath">
            <BorderFeedback>
              <CheckboxField
                type="switch"
                label="Morte accidentale"
                validationStyle={false}
              />
              <HelpText>
                In caso di morte dell'assicurato dovuta ad un evento
                accidentale, la compagnia liquida il doppio del capitale
                assicurato in caso di morte.
              </HelpText>
              <div>
                <strong>Durata: 30 anni</strong>
              </div>
              <div>
                <strong>
                  Capitale assicurato: {toCurrency(deathValue * 2)}
                </strong>
              </div>
            </BorderFeedback>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup controlId="trafficAccidentalDeath">
            <BorderFeedback>
              <CheckboxField
                type="switch"
                label="Morte per incidente stradale"
                validationStyle={false}
              />
              <HelpText>
                In caso di morte dell'assicurato dovuta ad un incidente
                stradale, la compagnia liquida il triplo del capitale assicurato
                in caso di morte.
              </HelpText>
              <div>
                <strong>Durata: 30 anni</strong>
              </div>
              <div>
                <strong>
                  Capitale assicurato: {toCurrency(deathValue * 3)}
                </strong>
              </div>
            </BorderFeedback>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup controlId="exemptionFromPaying">
            <BorderFeedback>
              <CheckboxField
                type="switch"
                label="Esonero dal pagamento dei premi"
                validationStyle={false}
              />
              <HelpText>
                Se entro i primi 10 anni di durata del contratto l'assicurato
                subisce un invalidità totale e permanente, la compagnia esonera
                il contraente/assicurato dall'obbligo di pagamento dei premi per
                il resto della durata del contratto.
              </HelpText>
              <div>
                <strong>Durata: 10 anni dall'attivazione del contratto</strong>
              </div>
            </BorderFeedback>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup controlId="pti">
            <BorderFeedback validationStyle={watch("pti.enabled")}>
              <CheckboxField
                type="switch"
                label="Invalidità permanente da infortunio o malattia"
                name="pti.enabled"
                onChange={() => {
                  trigger("pti.coverage", {shouldFocus: true});
                }}
                validationStyle={false}
              />
              <HelpText>
                In caso di invalidità permanente dell'assicurato, la compagnia
                liquida il 100% del capitale assicurato (dev'essere compreso tra{" "}
                {toCurrency(20_000)} e ### ###,00 €).
              </HelpText>
              <div>
                <strong>Durata: 10 anni dall'attivazione del contratto</strong>
              </div>
              <div className="d-sm-flex align-items-sm-center column-gap-sm-3">
                <FormLabel
                  className="text-nowrap mb-sm-0"
                  htmlFor="pti-coverage"
                >
                  Capitale assicurato
                </FormLabel>
                <InputField
                  disabled={!watch("pti.enabled")}
                  id="pti-coverage"
                  min={20_000}
                  name="pti.coverage"
                  placeholder="Capitale assicurato"
                  step={1_000}
                  type="number"
                  validation={{
                    validate: {
                      required: (value, formValues) => {
                        if (formValues.pti?.enabled && !value) {
                          return "Inserisci l'importo del capitale assicurato";
                        }
                      },
                      min: (value, formValues) => {
                        if (formValues.pti?.enabled && value < 20_000) {
                          return `Il capitale assicurato deve essere maggiore o uguale a ${toCurrency(
                            20_000,
                          )}`;
                        }
                      },
                      format: (value, formValues) => {
                        if (formValues.pti?.enabled && value % 1_000 !== 0) {
                          return `Il capitale assicurato deve essere multiplo di ${toCurrency(
                            1_000,
                          )}`;
                        }
                      },
                    },
                  }}
                  validationStyle={watch("pti.enabled")}
                />
              </div>
              <FieldError name="pti.coverage" />
            </BorderFeedback>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup controlId="cancer">
            <BorderFeedback validationStyle={watch("cancer.enabled")}>
              <CheckboxField
                type="switch"
                label="Cancro"
                name="cancer.enabled"
                onChange={() => {
                  trigger("cancer.coverage", {shouldFocus: true});
                }}
                validationStyle={false}
              />
              <HelpText>
                In caso di diagnosi di cancro dell'assicurato in forma lieve, la
                compagnia liquida il 10% del capitale assicurato. In caso di
                diagnosi di cancro viene liquidato il 100% del capitale
                assicurato (dev'essere compreso tra {toCurrency(20_000)} e ###
                ###,00 €).
              </HelpText>
              <div>
                <strong>Durata: 10 anni</strong>
              </div>
              <div className="d-sm-flex align-items-sm-center column-gap-sm-3">
                <FormLabel
                  className="text-nowrap mb-sm-0"
                  htmlFor="cancer-coverage"
                >
                  Capitale assicurato
                </FormLabel>
                <InputField
                  disabled={!watch("cancer.enabled")}
                  id="cancer-coverage"
                  min={20_000}
                  name="cancer.coverage"
                  placeholder="Capitale assicurato"
                  step={1_000}
                  type="number"
                  validation={{
                    validate: {
                      required: (value, formValues) => {
                        if (formValues.cancer?.enabled && !value) {
                          return "Inserisci l'importo del capitale assicurato";
                        }
                      },
                      min: (value, formValues) => {
                        if (formValues.cancer?.enabled && value < 20_000) {
                          return `Il capitale assicurato deve essere maggiore o uguale a ${toCurrency(
                            20_000,
                          )}`;
                        }
                      },
                      format: (value, formValues) => {
                        if (formValues.cancer?.enabled && value % 1_000 !== 0) {
                          return `Il capitale assicurato deve essere multiplo di ${toCurrency(
                            1_000,
                          )}`;
                        }
                      },
                    },
                  }}
                  validationStyle={watch("cancer.enabled")}
                />
              </div>
              <FieldError name="cancer.coverage" />
            </BorderFeedback>
          </FormGroup>
        </Col>
        <Col>
          <FormGroup controlId="ptd">
            <BorderFeedback validationStyle={watch("ptd.enabled")}>
              <CheckboxField
                type="switch"
                label="Perdita totale di autosufficienza"
                name="ptd.enabled"
                onChange={() => {
                  trigger("ptd.coverage", {shouldFocus: true});
                }}
                validationStyle={false}
              />
              <HelpText>
                In caso di perdita totale di autosufficienza dell'assicurato, la
                compagnia liquida il 100% del capitale assicurato (dev'essere
                compreso tra {toCurrency(20_000)} e ### ###,00 €).
              </HelpText>
              <div>
                <strong>Durata: 30 anni</strong>
              </div>
              <div className="d-sm-flex align-items-sm-center column-gap-sm-3">
                <FormLabel
                  className="text-nowrap mb-sm-0"
                  htmlFor="ptd-coverage"
                >
                  Capitale assicurato
                </FormLabel>
                <InputField
                  disabled={!watch("ptd.enabled")}
                  id="ptd-coverage"
                  min={20_000}
                  name="ptd.coverage"
                  placeholder="Capitale assicurato"
                  step={1_000}
                  type="number"
                  validation={{
                    validate: {
                      required: (value, formValues) => {
                        if (formValues.ptd?.enabled && !value) {
                          return "Inserisci l'importo del capitale assicurato";
                        }
                      },
                      min: (value, formValues) => {
                        if (formValues.ptd?.enabled && value < 20_000) {
                          return `Il capitale assicurato deve essere maggiore o uguale a ${toCurrency(
                            20_000,
                          )}`;
                        }
                      },
                      format: (value, formValues) => {
                        if (formValues.ptd?.enabled && value % 1_000 !== 0) {
                          return `Il capitale assicurato deve essere multiplo di ${toCurrency(
                            1_000,
                          )}`;
                        }
                      },
                    },
                  }}
                  validationStyle={watch("ptd.enabled")}
                />
              </div>
              <FieldError name="ptd.coverage" />
            </BorderFeedback>
          </FormGroup>
        </Col>
      </Row>
    </>
  );
}
