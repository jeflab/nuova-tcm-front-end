"use client";

import {
  PaymentMethodsOptions,
  paymentMethodsOptions,
} from "@/app/(menu)/(authenticated)/lips/[id]/PaymentForm";
import {getQuote} from "@/app/(menu)/quoter/actions";
import {Advantages} from "@/app/(menu)/quoter/Advantages";
import {getCoverageDuration} from "@/app/(menu)/quoter/helpers";
import {cns} from "@/helpers/cns";
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
  Collapse,
  FormCheck,
  FormGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {ComplementaryCoverages} from "./ComplementaryCoverages";
import {Coverages} from "./Coverages";
import {InsuredData} from "./InsuredData";
import styles from "./QuoterForm.module.scss";

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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodsOptions>();
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

    if (clientResponse.status === "failed") {
      throw {root: {type: "server", message: clientResponse.message}};
    }

    setPremium(clientResponse.quotazione.premium);
    setFirstTry(false);
  };

  const birthDate = formMethods.watch("birthDate");

  return (
    <Form
      onSubmit={handleSubmit}
      formMethods={formMethods}
      className="vstack gap-3"
      onChange={(e) => {
        if (formMethods.formState.isSubmitted) {
          console.log(e);
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
            duration={getCoverageDuration(birthDate)}
          />
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
                "Calcolo in corso..."
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
            <OverlayTrigger
              overlay={
                <Tooltip>
                  {isDetailsOpen ? "Chiudi dettagli" : "Dettagli"}
                </Tooltip>
              }
            >
              <Button
                type="button"
                variant="link"
                disabled={!premium}
                onClick={() => {
                  setIsDetailsOpen(!isDetailsOpen);
                }}
              >
                <FontAwesomeIcon
                  icon={isDetailsOpen ? faClose : faInfoCircle}
                  fixedWidth
                />
              </Button>
            </OverlayTrigger>
          </div>
        </AppContainer>
        <Collapse in={isDetailsOpen}>
          <div>
            <AppContainer>
              <Card body className="mt-4">
                {premium && (
                  <FormGroup>
                    <h4>Modalità di pagamento</h4>
                    {paymentMethodsOptions(premium, paymentMethod).map(
                      ({label, value}) => (
                        <FormCheck
                          key={value}
                          onChange={() => {
                            setPaymentMethod(value);
                          }}
                          label={label}
                          type="radio"
                          value={value}
                          className="form-switch"
                          name="non-quote-form"
                        />
                      ),
                    )}
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
