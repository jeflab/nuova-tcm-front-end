"use client";

import {paymentMethodsOptions} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {getQuote} from "@/app/(menu)/(authenticated)/quoter/actions";
import {Advantages} from "@/app/(menu)/(authenticated)/quoter/Advantages";
import {cns} from "@/helpers/cns";
import {normalizeError} from "@/helpers/errors";
import {AppContainer} from "@/ui/AppContainer";
import {Currency} from "@/ui/Currency";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {SubmitButton} from "@/ui/form/SubmitButton";
import {
  faArrowRotateLeft,
  faCalculator,
  faInfoCircle,
  faSpinner,
} from "@fortawesome/pro-duotone-svg-icons";
import {faClose} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ChangeEvent, useState} from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Collapse,
  FormCheck,
  FormGroup,
  Row,
} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {ComplementaryCoverages} from "./ComplementaryCoverages";
import {Coverages} from "./Coverages";
import {InsuredData} from "./InsuredData";
import styles from "./QuoterForm.module.scss";
import {getCoverageDuration} from "../lipsDrawers/quote/ComplementaryCoverages";

const quoterFormDefaultValues = {
  birthDate: "",
  smoker: "",
  death: "20000",
  accidentalDeath: false,
  trafficAccidentalDeath: false,
  exemptionFromPaying: false,
  tpi: {enabled: false, coverage: ""},
  cancer: {enabled: false, coverage: ""},
  tpd: {enabled: false, coverage: ""},
};
export type QuoterFormValues = typeof quoterFormDefaultValues;

export function QuoterForm() {
  const [premium, setPremium] = useState<number>();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [firstTry, setFirstTry] = useState(true);

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: quoterFormDefaultValues,
  });

  const handleSubmit = async (values: QuoterFormValues) => {
    let clientResponse: Awaited<ReturnType<typeof getQuote>>;
    try {
      clientResponse = await getQuote(values);
    } catch (error) {
      console.error(error);
      throw {
        root: {
          type: "server",
          message: "Errore imprevisto, riprova più tardi.",
        },
      };
    }

    if (clientResponse?.status !== "success") {
      throw {
        root: {type: "server", message: normalizeError(clientResponse).message},
      };
    }

    setPremium(clientResponse.quotazione.premium);
    setFirstTry(false);
  };

  const birthDate = formMethods.watch("birthDate");
  const deathValue = formMethods.watch("death");

  return (
    <Form
      onSubmit={handleSubmit}
      formMethods={formMethods}
      className="vstack gap-3"
      onChange={(e) => {
        if (formMethods.formState.isSubmitted) {
          if (
            (e as unknown as ChangeEvent<HTMLInputElement>).target.name !==
            "non-quote-form"
          ) {
            setPremium(undefined);
            setIsDetailsOpen(false);
          }
        }
      }}
    >
      <AppContainer>
        <Row xs={1} sm={2} className="row-gap-3 isolate">
          <InsuredData />
          <Coverages />
          <Advantages
            premium={premium ?? 0}
            duration={getCoverageDuration("death", birthDate)}
          />
          {Number(deathValue) > 300_000 ? (
            <Col className="w-100">
              <Alert variant="warning" className="mb-0">
                In virtù dell'importo del capitale assicurato per il caso di
                morte superiore a € 300.000, la proposta di Polizza sarà
                soggetta ad ulteriori approfondimenti.
              </Alert>
            </Col>
          ) : null}
          <ComplementaryCoverages />
        </Row>
      </AppContainer>
      <div className="position-sticky bottom-0 bg-primary-subtle py-3">
        <AppContainer className="d-flex gap-3">
          <div className="d-flex flex-grow-1 align-items-center justify-content-between flex-wrap gap-3">
            <FieldError
              name="root"
              as={Alert}
              variant="danger"
              className="mb-0 w-100"
            />
            <div className="hstack gap-2">
              <SubmitButton>
                <FontAwesomeIcon
                  icon={
                    formMethods.formState.isSubmitting
                      ? faSpinner
                      : faCalculator
                  }
                  className={cns(
                    "me-2",
                    formMethods.formState.isSubmitting && "fa-spin",
                  )}
                />
                Calcola preventivo
              </SubmitButton>
              <Button
                type="button"
                variant="cancel"
                onClick={() => {
                  formMethods.reset();
                  setIsDetailsOpen(false);
                  setPremium(undefined);
                }}
                className={styles.rotateOnFocus}
              >
                <FontAwesomeIcon icon={faArrowRotateLeft} className="me-2" />
                Reset
              </Button>
            </div>
            <div className="hstack gap-2">
              {formMethods.formState.isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} className="fa-spin" />{" "}
                  Calcolo in corso...
                </>
              ) : premium ? (
                <>
                  Premio mensile:{" "}
                  <Currency className="h4 mb-0 d-inline-block">
                    {premium / 12}
                  </Currency>
                </>
              ) : firstTry ? (
                "Compila il form per avere il preventivo della polizza."
              ) : (
                "Clicca nuovamente calcolo preventivo per aggiornare il preventivo."
              )}
            </div>
          </div>
          <div>
            <Button
              type="button"
              variant="info"
              disabled={!premium}
              onClick={() => {
                setIsDetailsOpen(!isDetailsOpen);
              }}
              className="text-nowrap"
            >
              <FontAwesomeIcon
                icon={isDetailsOpen ? faClose : faInfoCircle}
                className="me-sm-2"
                fixedWidth
              />
              <span className="d-none d-sm-inline">
                {isDetailsOpen ? "Meno" : "Maggiori"} dettagli
              </span>
            </Button>
          </div>
        </AppContainer>
        <Collapse in={isDetailsOpen}>
          <div>
            <AppContainer>
              <Card body className="mt-4">
                {premium && (
                  <FormGroup>
                    <h4>Modalità di pagamento</h4>
                    <h5>
                      Pagamento elettronico tramite Carta di Credito o Debito
                    </h5>
                    {paymentMethodsOptions(premium)
                      .filter((method) => method.type === "credit-card")
                      .map(({label, value}) => (
                        <FormCheck
                          key={value}
                          label={label}
                          type="radio"
                          value={value}
                          className="form-switch"
                          name="non-quote-form"
                          id={`non-quote-form-${value}`}
                        />
                      ))}
                    <h5>Pagamento tramite Bonifico - Addebito diretto SDD</h5>
                    {paymentMethodsOptions(premium)
                      .filter((method) => method.type === "transfer-sdd")
                      .map(({label, value}) => (
                        <FormCheck
                          key={value}
                          label={label}
                          type="radio"
                          value={value}
                          className="form-switch"
                          name="non-quote-form"
                          id={`non-quote-form-${value}`}
                        />
                      ))}
                  </FormGroup>
                )}
              </Card>
            </AppContainer>
          </div>
        </Collapse>
      </div>
    </Form>
  );
}
