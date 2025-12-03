import {
  complementaryCoverages,
  getCoverageDurationOld,
} from "@/app/(menu)/(authenticated)/lipsDrawers/quote/ComplementaryCoverages";
import {QuoterFormValues} from "@/app/(menu)/(authenticated)/quoter/QuoterForm";
import {calendarYearAge} from "@/helpers/ages";
import {Option} from "@/helpers/getOptionsLabel";
import {toCurrency} from "@/helpers/numbers";
import {Lip} from "@/models/entities/lip";
import {Currency} from "@/ui/Currency";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckboxField} from "@/ui/form/CheckboxField";
import {FieldError} from "@/ui/form/FieldError";
import {HelpText} from "@/ui/form/HelpText";
import {InputField} from "@/ui/form/InputField";
import {SelectField} from "@/ui/form/SelectField";
import {faTriangleExclamation} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Col, FormGroup, FormLabel, InputGroup} from "react-bootstrap";
import {useFormContext} from "react-hook-form";

interface ComplementaryCoveragesProps {
  lipType?: Lip["type"];
}

export function ComplementaryCoverages({lipType}: ComplementaryCoveragesProps) {
  const {watch, setValue} = useFormContext<QuoterFormValues>();
  const deathValue = watch("death");
  const birthDateValue = watch("birthDate");
  const isMoreThan75 =
    !!birthDateValue &&
    calendarYearAge(birthDateValue) > 75 &&
    calendarYearAge(birthDateValue) <= 85; // per escludere date erronee tipo 0001-06-24
  const isMoreThan65 =
    !!birthDateValue &&
    calendarYearAge(birthDateValue) > 65 &&
    calendarYearAge(birthDateValue) <= 85; // per escludere date erronee tipo 0001-06-24
  const isMoreThan55 =
    !!birthDateValue &&
    calendarYearAge(birthDateValue) > 55 &&
    calendarYearAge(birthDateValue) <= 85; // per escludere date erronee tipo 0001-06-24

  const accidentalDeathCoverageValue =
    Number(deathValue) <= 500_000 ? Number(deathValue) * 2 : 0;
  const trafficAccidentalDeathCoverageValue =
    Number(deathValue) <= 333_333 ? Number(deathValue) * 3 : 0;

  const tpdOptions: Option[] = [];
  for (
    let i = 500;
    i * 48 <= Math.min(parseInt(deathValue, 10), 96000);
    i += 100
  ) {
    tpdOptions.push({value: i.toString(), label: toCurrency(i)});
  }

  return (
    <>
      <h3 className="w-100">
        <em>Coperture complementari</em>
      </h3>
      <Col className="vstack column-gap-3">
        <FormGroup
          controlId="accidentalDeath"
          as={BorderFeedback}
          disabled={isMoreThan75 || accidentalDeathCoverageValue === 0}
          className="position-relative"
        >
          <CheckboxField
            disabled={isMoreThan75 || accidentalDeathCoverageValue === 0}
            type="switch"
            label="Morte da infortunio"
            validationStyle={watch("accidentalDeath")}
            stretchedLabel
          />
          <HelpText>
            In caso di morte dell'assicurato dovuta ad un evento accidentale, la
            compagnia liquida il doppio del capitale assicurato in caso di
            morte.
          </HelpText>
          <div>
            {isMoreThan75 ? (
              <strong className="text-warning">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="me-2"
                />
                Opzione non attivabile per gli assicurati con più di 75 anni
              </strong>
            ) : accidentalDeathCoverageValue === 0 ? (
              <strong className="text-warning">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="me-2"
                />
                Opzione non attivabile con capitale assicurato superiore a{" "}
                <Currency>{500_000}</Currency>
              </strong>
            ) : (
              <strong>
                Durata: {getCoverageDurationOld(watch("birthDate"))} anni
              </strong>
            )}
          </div>
          <div>
            <strong>
              Capitale assicurato:{" "}
              <Currency>{accidentalDeathCoverageValue}</Currency>
            </strong>
          </div>
        </FormGroup>
      </Col>
      <Col className="vstack column-gap-3">
        <FormGroup
          controlId="trafficAccidentalDeath"
          as={BorderFeedback}
          disabled={isMoreThan75 || trafficAccidentalDeathCoverageValue === 0}
          className="position-relative"
        >
          <CheckboxField
            disabled={isMoreThan75 || trafficAccidentalDeathCoverageValue === 0}
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
            {isMoreThan75 ? (
              <strong className="text-warning">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="me-2"
                />
                Opzione non attivabile per gli assicurati con più di 75 anni
              </strong>
            ) : trafficAccidentalDeathCoverageValue === 0 ? (
              <strong className="text-warning">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="me-2"
                />
                Opzione non attivabile con capitale assicurato superiore a{" "}
                <Currency>{333_333}</Currency>
              </strong>
            ) : (
              <strong>
                Durata: {getCoverageDurationOld(watch("birthDate"))} anni
              </strong>
            )}
          </div>
          <div>
            <strong>
              Capitale assicurato:{" "}
              <Currency>{trafficAccidentalDeathCoverageValue}</Currency>
            </strong>
          </div>
        </FormGroup>
      </Col>
      <Col className="vstack column-gap-3">
        <FormGroup
          controlId="exemptionFromPaying"
          as={BorderFeedback}
          disabled={isMoreThan55 || (lipType && lipType !== "self-insured")}
          className="position-relative"
        >
          <CheckboxField
            disabled={isMoreThan55 || (lipType && lipType !== "self-insured")}
            type="switch"
            label="Esonero dal pagamento dei premi"
            validationStyle={watch("exemptionFromPaying")}
            stretchedLabel
          />
          <HelpText>
            Se, entro i primi 10 anni di Durata del Contratto, l’Assicurato
            subisce un’Invalidità totale e Permanente, la Compagnia esonera il
            Contraente/Assicurato dall’obbligo di pagamento dei Premi per il
            resto della durata del contratto.
          </HelpText>
          <div>
            {isMoreThan55 ? (
              <strong className="text-warning">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="me-2"
                />
                Opzione non attivabile per gli assicurati con più di 55 anni
              </strong>
            ) : lipType && lipType !== "self-insured" ? (
              <strong className="text-warning">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="me-2"
                />
                Opzione non attivabile per le polizze con Contraente diverso
                dall'Assicurato
              </strong>
            ) : (
              <strong>
                Durata: {getCoverageDurationOld(watch("birthDate"), 10, 65)}{" "}
                {getCoverageDurationOld(watch("birthDate"), 10, 65) === 1
                  ? "anno"
                  : "anni"}
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
            onChange={(value) => {
              if (value.currentTarget.checked) {
                setValue("tpi.coverage", "20000", {shouldValidate: true});
              } else {
                setValue("tpi.coverage", "", {shouldValidate: true});
              }
            }}
            validationStyle={watch("tpi.enabled")}
            stretchedLabel
          />
          <HelpText>
            Se, entro i primi 10 anni di Durata del Contratto, l’Assicurato
            subisce un’Invalidità totale e Permanente, la Compagnia liquida al
            Beneficiario una somma pari al 100% del Capitale Assicurato indicato
            in Polizza per l’Assicurazione Complementare Invalidità Totale e
            Permanente. Dev'essere compreso tra <Currency>{20_000}</Currency> e{" "}
            <Currency>
              {Math.min(
                parseInt(watch("death"), 10),
                complementaryCoverages.tpi.maxCoverage,
              )}
            </Currency>
            ).
          </HelpText>
          <div>
            {!isMoreThan55 ? (
              <strong>
                Durata: {getCoverageDurationOld(watch("birthDate"), 10, 65)}{" "}
                {getCoverageDurationOld(watch("birthDate"), 10, 65) === 1
                  ? "anno"
                  : "anni"}
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
            <InputGroup>
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
                        value >
                          Math.min(
                            parseInt(formValues.death, 10),
                            complementaryCoverages.tpi.maxCoverage,
                          )
                      ) {
                        return `Il capitale assicurato deve essere minore o uguale a ${toCurrency(
                          Math.min(
                            parseInt(formValues.death, 10),
                            complementaryCoverages.tpi.maxCoverage,
                          ),
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
              <InputGroup.Text>,00 €</InputGroup.Text>
            </InputGroup>
          </div>
        </FormGroup>
      </Col>
      <Col className="vstack column-gap-3">
        <FormGroup
          controlId="cancer"
          as={BorderFeedback}
          validationStyle={watch("cancer.enabled")}
          disabled={isMoreThan65}
          className="position-relative"
        >
          <CheckboxField
            disabled={isMoreThan65}
            type="switch"
            label="Cancro"
            name="cancer.enabled"
            onChange={(value) => {
              if (value.currentTarget.checked) {
                setValue("cancer.coverage", "20000", {shouldValidate: true});
              } else {
                setValue("cancer.coverage", "", {shouldValidate: true});
              }
            }}
            validationStyle={watch("cancer.enabled")}
            stretchedLabel
          />
          <HelpText>
            In caso di diagnosi di cancro dell'assicurato in forma lieve, la
            compagnia liquida il 10% del capitale assicurato. In caso di
            diagnosi di cancro viene liquidato il 100% del capitale assicurato
            (dev'essere compreso tra <Currency>{20_000}</Currency> e{" "}
            <Currency>
              {Math.min(parseInt(watch("death"), 10), 100_000)}
            </Currency>
            ).
          </HelpText>
          <div>
            {!isMoreThan65 ? (
              <strong>
                Durata: {getCoverageDurationOld(watch("birthDate"), 10, 75)}{" "}
                anni
              </strong>
            ) : (
              <strong className="text-warning">
                <FontAwesomeIcon
                  icon={faTriangleExclamation}
                  className="me-2"
                />
                Opzione non attivabile per gli assicurati con più di 65 anni
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
            <InputGroup>
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
                      if (
                        formValues.cancer?.enabled &&
                        !isMoreThan75 &&
                        !value
                      ) {
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
                        value >
                          Math.min(parseInt(formValues.death, 10), 100_000)
                      ) {
                        return `Il capitale assicurato deve essere minore o uguale a ${toCurrency(
                          Math.min(parseInt(formValues.death, 10), 100_000),
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
              <InputGroup.Text>,00 €</InputGroup.Text>
            </InputGroup>
          </div>
        </FormGroup>
      </Col>
      <Col className="vstack column-gap-3">
        <FormGroup
          controlId="tpd"
          as={BorderFeedback}
          validationStyle={watch("tpd.enabled")}
          disabled={isMoreThan75 || tpdOptions.length === 0}
          className="position-relative"
        >
          <CheckboxField
            disabled={isMoreThan75 || tpdOptions.length === 0}
            type="switch"
            label="Perdita totale di autosufficienza"
            name="tpd.enabled"
            onChange={(value) => {
              if (value.currentTarget.checked) {
                setValue("tpd.coverage", "500", {shouldValidate: true});
              } else {
                setValue("tpd.coverage", "", {shouldValidate: true});
              }
            }}
            validationStyle={watch("tpd.enabled")}
            stretchedLabel
          />
          <HelpText>
            In caso di perdita totale di autosufficienza dell'assicurato, La
            compagnia corrisponde la rendita mensile pari all’importo
            selezionato, per una durata di 48 mesi.
          </HelpText>
          <div>
            {!isMoreThan75 ? (
              <strong>
                Durata: {getCoverageDurationOld(watch("birthDate"))} anni
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
              Rendita mensile
            </FormLabel>
            <SelectField
              id="tpd-coverage"
              name="tpd.coverage"
              options={tpdOptions}
              disabled={
                !watch("tpd.enabled") || isMoreThan75 || tpdOptions.length === 0
              }
              placeholder="Capitale assicurato"
              validation={{
                validate: {
                  required: (value, formValues) => {
                    if (formValues.tpd?.enabled && !isMoreThan75 && !value) {
                      return "Inserisci l'importo del capitale assicurato";
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
