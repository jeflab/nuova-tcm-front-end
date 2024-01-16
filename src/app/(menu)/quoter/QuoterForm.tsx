"use client";

import {getQuote} from "@/app/(menu)/quoter/actions";
import {Advantages} from "@/app/(menu)/quoter/Advantages";
import {cns} from "@/helpers/cns";
import {toCurrency} from "@/helpers/numbers";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {SubmitButton} from "@/ui/form/SubmitButton";
import {
  faArrowRotateLeft,
  faCalculator,
  faSpinner,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useDebouncedCallback from "beautiful-react-hooks/useDebouncedCallback";
import {useState} from "react";
import {Alert, Button, Card, CardBody, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import {ComplementaryCoverages} from "./ComplementaryCoverages";
import {Coverages} from "./Coverages";
import {InsuredData} from "./InsuredData";
import styles from "./QuoterForm.module.scss";
import {AppContainer} from "@/ui/AppContainer";

const quoterFormDefaultValues = {
  birthDate: "",
  smoker: "",
  death: "20000",
  accidentalDeath: false,
  trafficAccidentalDeath: false,
  exemptionFromPaying: false,
  tpi: {enabled: false, coverage: "20000"},
  cancer: {enabled: false, coverage: "20000"},
  tpd: {enabled: false, coverage: "20000"},
};
export type QuoterFormValues = typeof quoterFormDefaultValues;

export function QuoterForm() {
  const [premium, setPremium] = useState<number>();
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
  };

  const handleFormChange = useDebouncedCallback(() => {
    if (formMethods.formState.isSubmitted) {
      formMethods.handleSubmit(handleSubmit)();
    }
  }, [formMethods]);

  return (
    <Form
      onSubmit={handleSubmit}
      formMethods={formMethods}
      className="vstack gap-3"
      onChange={handleFormChange}
    >
      <AppContainer>
        <Row xs={1} sm={2} className="row-gap-3 isolate">
          <InsuredData />
          <Coverages />
          <Advantages premium={premium ?? 0} />
          <ComplementaryCoverages />
        </Row>
      </AppContainer>
      <div className="position-sticky bottom-0 bg-primary-subtle py-3">
        <AppContainer className="d-flex align-items-center justify-content-between flex-wrap gap-3">
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
                  formMethods.formState.isSubmitting ? faSpinner : faCalculator
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
                setPremium(undefined);
              }}
              className={styles.rotateOnFocus}
            >
              <FontAwesomeIcon icon={faArrowRotateLeft} className="me-2" />
              Reset
            </Button>
          </div>
          <div>
            {formMethods.formState.isSubmitting
              ? "Calcolo in corso..."
              : premium
                ? `Premio mensile: ${toCurrency(premium / 12)}`
                : "Compila il form per avere il preventivo della polizza."}
          </div>
        </AppContainer>
      </div>
    </Form>
  );
}
