"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Currency} from "@/ui/Currency";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {validateIBAN} from "@/ui/form/validators/iban";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  Button,
  Col,
  Collapse,
  FormGroup,
  FormLabel,
  ModalBody,
  ModalFooter,
  Row,
} from "react-bootstrap";
import {useForm} from "react-hook-form";

export function paymentMethodsOptions<T>(
  premium: number,
  paymentMethodValue: T,
) {
  return [
    {
      label: (
        <>
          Pagamento mensile di <Currency>{premium / 12}</Currency> con anticipo
          di 3 mesi (<Currency>{(premium / 12) * 3}</Currency>)
        </>
      ),
      value: "monthly",
    },
    {
      label: (
        <>
          Pagamento annuale di <Currency>{premium}</Currency>
        </>
      ),
      value: "annual",
    },
    {
      label: (
        <>
          Sconto del 10%
          <Collapse in={paymentMethodValue === "3yearsAdvance"}>
            <div style={{textTransform: "none"}}>
              Pagamento anticipato di 3 anni con sconto del 10% (
              <Currency>{premium * 3 * 0.9}</Currency>) e a seguire pagamento
              mensile di <Currency>{premium / 12}</Currency>
            </div>
          </Collapse>
        </>
      ),
      value: "3yearsAdvance",
    },
    {
      label: (
        <>
          Sconto del 15%
          <Collapse in={paymentMethodValue === "5yearsAdvance"}>
            <div style={{textTransform: "none"}}>
              Pagamento anticipato di 5 anni con sconto del 15% (
              <Currency>{premium * 5 * 0.85}</Currency>) e a seguire pagamento
              mensile di <Currency>{premium / 12}</Currency>
            </div>
          </Collapse>
        </>
      ),
      value: "5yearsAdvance",
    },
  ] as const;
}
export type PaymentMethodsOptions = ReturnType<
  typeof paymentMethodsOptions
>[number]["value"];

const paymentDefaultValues = {
  bank: "",
  iban: "",
  paymentMethod: "" as PaymentMethodsOptions,
};

export function PaymentForm() {
  const formMethods = useForm({
    mode: "onChange",
    defaultValues: paymentDefaultValues,
  });

  const updatePaymentData = useDrawerStore((state) => state.updatePaymentData);
  const closeModal = useDrawerStore((state) => state.closeModal);
  const premium = useDrawerStore((state) => state.lipData.quote?.premium)!;

  const paymentMethodValue = formMethods.watch("paymentMethod");

  return (
    <>
      <ModalBody>
        <Form
          id="payment-form"
          onSubmit={(values) => {
            updatePaymentData(values);
            closeModal();
          }}
          formMethods={formMethods}
          className="vstack gap-3"
        >
          <Row className="row-gap-3">
            <h4>Dati bancari del contraente</h4>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="bank" as={BorderFeedback}>
                <FormLabel>Banca</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Banca"
                  validation={{
                    required: "Inserisci il nome della tua banca",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="iban" as={BorderFeedback}>
                <FormLabel>IBAN</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="IBAN"
                  validation={{
                    validate: {
                      required: (value) => {
                        if (!value) {
                          return "Inserisci l'IBAN del contraente";
                        }
                      },
                      format: (value) => {
                        if (!validateIBAN(value)) {
                          return "Inserisci un IBAN valido";
                        }
                      },
                    },
                  }}
                />
              </FormGroup>
            </Col>
            <h4>Modalità di pagamento</h4>
            <Col className="d-flex">
              <FormGroup controlId="paymentMethod" as={BorderFeedback}>
                <FormLabel>Modalità di pagamento</FormLabel>
                <FieldError />
                <CheckGroup
                  type="radio-switch"
                  options={paymentMethodsOptions(premium, paymentMethodValue)}
                />
              </FormGroup>
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="cancel" onClick={() => closeModal()}>
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          Annulla
        </Button>
        <Button type="submit" variant="primary" form="payment-form">
          {formMethods.formState.isSubmitting ? (
            <FontAwesomeIcon icon={faSpinner} className="fa-spin me-2" />
          ) : (
            <FontAwesomeIcon icon={faSave} className="me-2" />
          )}
          Salva e Concludi
        </Button>
      </ModalFooter>
    </>
  );
}
