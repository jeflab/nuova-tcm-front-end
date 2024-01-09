"use client";

import {Advantages} from "@/app/(menu)/quoter/Advantages";
import {cns} from "@/helpers/cns";
import {toCurrency} from "@/helpers/numbers";
import {getQuote} from "@/services/quoter";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {SubmitButton} from "@/ui/form/SubmitButton";
import {
  faArrowRotateLeft,
  faCalculator,
  faSpinner,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {Alert, Button, Card, CardBody, Row} from "react-bootstrap";
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
    const clientResponse = await getQuote(values);

    if (clientResponse.status === "failed") {
      throw {root: {type: "server", message: clientResponse.message}};
    }

    setPremium(clientResponse.quotazione.premium);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      formMethods={formMethods}
      className="vstack gap-3"
      onChange={() => {
        if (formMethods.formState.isSubmitted) {
          setPremium(undefined);
        }
      }}
    >
      <Row xs={1} sm={2} className="row-gap-3">
        <InsuredData />
        <Coverages />
        <Advantages />
        <ComplementaryCoverages />
      </Row>
      <Card className="position-sticky bottom-0 border-0 rounded-0 bg-primary-subtle">
        <CardBody className="d-flex align-items-center justify-content-between flex-wrap gap-3">
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
            {premium
              ? `Premio mensile: ${toCurrency(premium)}`
              : "Compila il form e premi per avere il preventivo della polizza."}
          </div>
        </CardBody>
      </Card>
    </Form>
  );
}
