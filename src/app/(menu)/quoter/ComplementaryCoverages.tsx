import {getCoverageDuration} from "@/app/(menu)/quoter/helpers";
import {calendarYearAge} from "@/helpers/ages";
import {toCurrency} from "@/helpers/numbers";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckboxField} from "@/ui/form/CheckboxField";
import {FieldError} from "@/ui/form/FieldError";
import {HelpText} from "@/ui/form/HelpText";
import {InputField} from "@/ui/form/InputField";
import {faTriangleExclamation} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col, FormGroup, FormLabel} from "react-bootstrap";
import {useFormContext} from "react-hook-form";

export function ComplementaryCoverages() {
  const {trigger, watch} = useFormContext();
  const deathValue = watch("death");
  const birthDateValue = watch("birthDate");
  const isMoreThan75 = birthDateValue && calendarYearAge(birthDateValue) > 75;
  const isMoreThan55 = birthDateValue && calendarYearAge(birthDateValue) > 55;

  return (
    <>
      <h3 className="w-100">
        <em>Coperture complementari</em>
      </h3>
      <Col className="vstack column-gap-3">
        <FormGroup
          controlId="accidentalDeath"
          as={BorderFeedback}
          disabled={isMoreThan75}
          className="position-relative"
        >
          <CheckboxField
            disabled={isMoreThan75}
            type="switch"
            label="Morte accidentale"
            validationStyle={watch("accidentalDeath")}
            stretchedLabel
          />
          <HelpText>
            In caso di morte dell'assicurato dovuta ad un evento accidentale, la
            compagnia liquida il doppio del capitale assicurato in caso di
            morte.
          </HelpText>
          <div>
            {!isMoreThan75 ? (
              <strong>
                Durata: {getCoverageDuration(watch("birthDate"))} anni
              </strong>
            ) : (
              <strong className="text-warning">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="me-2"
                />
                Opzione non attivabile per gli assicurati con più di 75 anni
              </strong>
            )}
          </div>
          <div>
            <strong>Capitale assicurato: {toCurrency(deathValue * 2)}</strong>
          </div>
        </FormGroup>
      </Col>
      <Col className="vstack column-gap-3">
        <FormGroup
          controlId="trafficAccidentalDeath"
          as={BorderFeedback}
          disabled={isMoreThan75}
          className="position-relative"
        >
          <CheckboxField
            disabled={isMoreThan75}
            type="switch"
            label="Morte per incidente stradale"
            validationStyle={watch("trafficAccidentalDeath")}
            stretchedLabel
          />
          <HelpText>
            In caso di morte dell'assicurato dovuta ad un incidente stradale, la
            compagnia liquida il triplo del capitale assicurato in caso di
            morte.
          </HelpText>
          <div>
            {!isMoreThan75 ? (
              <strong>
                Durata: {getCoverageDuration(watch("birthDate"))} anni
              </strong>
            ) : (
              <strong className="text-warning">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="me-2"
                />
                Opzione non attivabile per gli assicurati con più di 75 anni
              </strong>
            )}
          </div>
          <div>
            <strong>Capitale assicurato: {toCurrency(deathValue * 3)}</strong>
          </div>
        </FormGroup>
      </Col>
      <Col className="vstack column-gap-3">
        <FormGroup
          controlId="exemptionFromPaying"
          as={BorderFeedback}
          disabled={isMoreThan55}
          className="position-relative"
        >
          <CheckboxField
            disabled={isMoreThan55}
            type="switch"
            label="Esonero dal pagamento dei premi"
            validationStyle={watch("exemptionFromPaying")}
            stretchedLabel
          />
          <HelpText>
            Se entro i primi 10 anni di durata del contratto l'assicurato
            subisce un invalidità totale e permanente, la compagnia esonera il
            contraente/assicurato dall'obbligo di pagamento dei premi per il
            resto della durata del contratto.
          </HelpText>
          <div>
            {!isMoreThan55 ? (
              <strong>
                Durata: {getCoverageDuration(watch("birthDate"), 30, 65)} anni
                dall'attivazione del contratto
              </strong>
            ) : (
              <strong className="text-warning">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="me-2"
                />
                Opzione non attivabile per gli assicurati con più di 55 anni
              </strong>
            )}
          </div>
        </FormGroup>
      </Col>
      <Col className="vstack column-gap-3">
        <FormGroup
          controlId="tpi"
          as={BorderFeedback}
          validationStyle={watch("tpi.enabled")}
          disabled={isMoreThan55}
          className="position-relative"
        >
          <CheckboxField
            disabled={isMoreThan55}
            type="switch"
            label="Invalidità permanente da infortunio o malattia"
            name="tpi.enabled"
            onChange={() => {
              trigger("tpi.coverage", {shouldFocus: true});
            }}
            validationStyle={watch("tpi.enabled")}
            stretchedLabel
          />
          <HelpText>
            In caso di invalidità permanente dell'assicurato, la compagnia
            liquida il 100% del capitale assicurato (dev'essere compreso tra{" "}
            {toCurrency(20_000)} e {toCurrency(watch("death"))}).
          </HelpText>
          <div>
            {!isMoreThan55 ? (
              <strong>
                Durata: {getCoverageDuration(watch("birthDate"), 10, 65)} anni
                dall'attivazione del contratto
              </strong>
            ) : (
              <strong className="text-warning">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="me-2"
                />
                Opzione non attivabile per gli assicurati con più di 55 anni
              </strong>
            )}
          </div>
          <FieldError name="tpi.coverage" />
          <div className="d-flex flex-column flex-md-row align-items-md-center column-gap-3 row-gap-1">
            <FormLabel className="text-nowrap mb-sm-0" htmlFor="tpi-coverage">
              Capitale assicurato
            </FormLabel>
            <InputField
              disabled={!watch("tpi.enabled") || isMoreThan55}
              id="tpi-coverage"
              min={20_000}
              max={watch("death")}
              name="tpi.coverage"
              placeholder="Capitale assicurato"
              step={1_000}
              type="number"
              validation={{
                validate: {
                  required: (value, formValues) => {
                    if (formValues.tpi?.enabled && !isMoreThan55 && !value) {
                      return "Inserisci l'importo del capitale assicurato";
                    }
                  },
                  min: (value, formValues) => {
                    if (
                      formValues.tpi?.enabled &&
                      !isMoreThan55 &&
                      value < 20_000
                    ) {
                      return `Il capitale assicurato deve essere maggiore o uguale a ${toCurrency(
                        20_000,
                      )}`;
                    }
                  },
                  max: (value, formValues) => {
                    if (
                      formValues.tpi?.enabled &&
                      !isMoreThan55 &&
                      value > formValues.death
                    ) {
                      return `Il capitale assicurato deve essere minore o uguale a ${toCurrency(
                        formValues.death,
                      )}`;
                    }
                  },
                  format: (value, formValues) => {
                    if (
                      formValues.tpi?.enabled &&
                      !isMoreThan55 &&
                      value % 1_000 !== 0
                    ) {
                      return `Il capitale assicurato deve essere multiplo di ${toCurrency(
                        1_000,
                      )}`;
                    }
                  },
                },
              }}
              validationStyle={watch("tpi.enabled")}
            />
          </div>
        </FormGroup>
      </Col>
      <Col className="vstack column-gap-3">
        <FormGroup
          controlId="cancer"
          as={BorderFeedback}
          validationStyle={watch("cancer.enabled")}
          disabled={isMoreThan75}
          className="position-relative"
        >
          <CheckboxField
            disabled={isMoreThan75}
            type="switch"
            label="Cancro"
            name="cancer.enabled"
            onChange={() => {
              trigger("cancer.coverage", {shouldFocus: true});
            }}
            validationStyle={watch("cancer.enabled")}
            stretchedLabel
          />
          <HelpText>
            In caso di diagnosi di cancro dell'assicurato in forma lieve, la
            compagnia liquida il 10% del capitale assicurato. In caso di
            diagnosi di cancro viene liquidato il 100% del capitale assicurato
            (dev'essere compreso tra {toCurrency(20_000)} e{" "}
            {toCurrency(watch("death"))}).
          </HelpText>
          <div>
            {!isMoreThan75 ? (
              <strong>
                Durata: {getCoverageDuration(watch("birthDate"), 10)} anni
              </strong>
            ) : (
              <strong className="text-warning">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="me-2"
                />
                Opzione non attivabile per gli assicurati con più di 75 anni
              </strong>
            )}
          </div>
          <FieldError name="cancer.coverage" />
          <div className="d-flex flex-column flex-md-row align-items-md-center column-gap-3 row-gap-1">
            <FormLabel
              className="text-nowrap mb-sm-0"
              htmlFor="cancer-coverage"
            >
              Capitale assicurato
            </FormLabel>
            <InputField
              disabled={!watch("cancer.enabled") || isMoreThan75}
              id="cancer-coverage"
              min={20_000}
              max={watch("death")}
              name="cancer.coverage"
              placeholder="Capitale assicurato"
              step={1_000}
              type="number"
              validation={{
                validate: {
                  required: (value, formValues) => {
                    if (formValues.cancer?.enabled && !isMoreThan75 && !value) {
                      return "Inserisci l'importo del capitale assicurato";
                    }
                  },
                  min: (value, formValues) => {
                    if (
                      formValues.cancer?.enabled &&
                      !isMoreThan75 &&
                      value < 20_000
                    ) {
                      return `Il capitale assicurato deve essere maggiore o uguale a ${toCurrency(
                        20_000,
                      )}`;
                    }
                  },
                  max: (value, formValues) => {
                    if (
                      formValues.cancer?.enabled &&
                      !isMoreThan75 &&
                      value > formValues.death
                    ) {
                      return `Il capitale assicurato deve essere minore o uguale a ${toCurrency(
                        formValues.death,
                      )}`;
                    }
                  },
                  format: (value, formValues) => {
                    if (
                      formValues.cancer?.enabled &&
                      !isMoreThan75 &&
                      value % 1_000 !== 0
                    ) {
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
        </FormGroup>
      </Col>
      <Col className="vstack column-gap-3">
        <FormGroup
          controlId="tpd"
          as={BorderFeedback}
          validationStyle={watch("tpd.enabled")}
          disabled={isMoreThan75}
          className="position-relative"
        >
          <CheckboxField
            disabled={isMoreThan75}
            type="switch"
            label="Perdita totale di autosufficienza"
            name="tpd.enabled"
            onChange={() => {
              trigger("tpd.coverage", {shouldFocus: true});
            }}
            validationStyle={watch("tpd.enabled")}
            stretchedLabel
          />
          <HelpText>
            In caso di perdita totale di autosufficienza dell'assicurato, la
            compagnia liquida il 100% del capitale assicurato (dev'essere
            compreso tra {toCurrency(20_000)} e {toCurrency(watch("death"))}).
          </HelpText>
          <div>
            {!isMoreThan75 ? (
              <strong>
                Durata: {getCoverageDuration(watch("birthDate"))} anni
              </strong>
            ) : (
              <strong className="text-warning">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="me-2"
                />
                Opzione non attivabile per gli assicurati con più di 75 anni
              </strong>
            )}
          </div>
          <FieldError name="tpd.coverage" />
          <div className="d-flex flex-column flex-md-row align-items-md-center column-gap-3 row-gap-1">
            <FormLabel className="text-nowrap mb-sm-0" htmlFor="tpd-coverage">
              Capitale assicurato
            </FormLabel>
            <InputField
              disabled={!watch("tpd.enabled") || isMoreThan75}
              id="tpd-coverage"
              min={20_000}
              max={watch("death")}
              name="tpd.coverage"
              placeholder="Capitale assicurato"
              step={1_000}
              type="number"
              validation={{
                validate: {
                  required: (value, formValues) => {
                    if (
                      formValues.tpd?.enabled &&
                      getCoverageDuration(watch("birthDate")) > 0 &&
                      !value
                    ) {
                      return "Inserisci l'importo del capitale assicurato";
                    }
                  },
                  min: (value, formValues) => {
                    if (
                      formValues.tpd?.enabled &&
                      getCoverageDuration(watch("birthDate")) > 0 &&
                      value < 20_000
                    ) {
                      return `Il capitale assicurato deve essere maggiore o uguale a ${toCurrency(
                        20_000,
                      )}`;
                    }
                  },
                  max: (value, formValues) => {
                    if (
                      formValues.tpd?.enabled &&
                      !isMoreThan75 &&
                      value > formValues.death
                    ) {
                      return `Il capitale assicurato deve essere minore o uguale a ${toCurrency(
                        formValues.death,
                      )}`;
                    }
                  },
                  format: (value, formValues) => {
                    if (
                      formValues.tpd?.enabled &&
                      getCoverageDuration(watch("birthDate")) > 0 &&
                      value % 1_000 !== 0
                    ) {
                      return `Il capitale assicurato deve essere multiplo di ${toCurrency(
                        1_000,
                      )}`;
                    }
                  },
                },
              }}
              validationStyle={watch("tpd.enabled")}
            />
          </div>
        </FormGroup>
      </Col>
    </>
  );
}
