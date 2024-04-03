"use client";

import {updatePaymentData} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {getCoverageDuration} from "@/app/(menu)/quoter/helpers";
import {dbDateString} from "@/helpers/dates";
import {Lip} from "@/models/entities/lip";
import {Currency} from "@/ui/Currency";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {upperCaseNormalizer} from "@/ui/form/normalizers";
import {validateIBAN} from "@/ui/form/validators/iban";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {addYears} from "date-fns/addYears";
import {endOfYear} from "date-fns/endOfYear";
import {
  Button,
  Col,
  FormGroup,
  FormLabel,
  ModalBody,
  ModalFooter,
  Row,
  Collapse,
} from "react-bootstrap";
import {useForm} from "react-hook-form";
import invariant from "tiny-invariant";

// Payments
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
export type PaymentMethods = ReturnType<
  typeof paymentMethodsOptions
>[number]["value"];

const paymentDefaultValues = (paymentData?: Lip["payment"]) => ({
  effectiveDate: paymentData?.effectiveDate ?? "",
  duration: paymentData?.duration ?? "",
  expirationDate: paymentData?.expirationDate ?? "",
  paymentMethod: paymentData?.paymentMethod ?? ("" as PaymentMethods),
  contractorFullName: paymentData?.contractorFullName ?? "",
  bank: paymentData?.bank ?? "",
  bicSwift: paymentData?.bicSwift ?? "",
  iban: paymentData?.iban ?? "",
});
export type PaymentFormValues = ReturnType<typeof paymentDefaultValues>;

export function PaymentForm() {
  const lipId = useDrawerStore((state) => state.lip?.id);
  const birthDate = useDrawerStore((state) => state.lip?.contractor.birthDate)!;
  const contractorName = useDrawerStore((state) => state.lip?.contractor.name);
  const contractorSurname = useDrawerStore(
    (state) => state.lip?.contractor.surname,
  );
  const paymentData = useDrawerStore((state) => state.lip?.payment);

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: {
      ...paymentDefaultValues(paymentData),
      contractorFullName: `${contractorName} ${contractorSurname}`,
      duration: getCoverageDuration(birthDate).toString(),
      expirationDate: addYears(new Date(), getCoverageDuration(birthDate))
        .getFullYear()
        .toString(),
    },
  });

  const closeModal = useDrawerStore((state) => state.closeModal);
  const premium = useDrawerStore((state) => state.lip?.quotation?.premium)!;

  const paymentMethodValue = formMethods.watch("paymentMethod");

  return (
    <>
      <ModalBody>
        <Form
          id="payment-form"
          onSubmit={async (values) => {
            invariant(lipId, "lipId is required");

            const updatedContractor = await updatePaymentData(values, lipId);

            if (updatedContractor.status === "failed") {
              throw {
                root: {
                  type: "server",
                  message: updatedContractor.message,
                },
              };
            }

            closeModal();
          }}
          formMethods={formMethods}
          className="vstack gap-3"
        >
          <Row className="row-gap-3">
            <h4>Decorrenza assicurazione e premio</h4>
            <Col className="d-flex" xs={12} sm={4}>
              <FormGroup controlId="effectiveDate" as={BorderFeedback}>
                <FormLabel>Data di decorrenza del contratto</FormLabel>
                <FieldError />
                <InputField
                  type="date"
                  placeholder="Data decorrenza contratto"
                  max={dbDateString(endOfYear(new Date()))}
                  min={dbDateString()}
                  validation={{
                    required: "Inserisci la data di decorrenza del contratto",
                    max: {
                      value: dbDateString(endOfYear(new Date())),
                      message:
                        "La data di decorrenza dev'essere entro la fine dell'anno",
                    },
                    min: {
                      value: dbDateString(),
                      message:
                        "La data di decorrenza non può essere antecedente a oggi",
                    },
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={4}>
              <FormGroup controlId="duration" as={BorderFeedback}>
                <FormLabel>Durata in anni</FormLabel>
                <FieldError />
                <InputField type="text" readOnly plaintext />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={4}>
              <FormGroup controlId="expirationDate" as={BorderFeedback}>
                <FormLabel>Anno di scadenza</FormLabel>
                <FieldError />
                <InputField type="text" readOnly plaintext />
              </FormGroup>
            </Col>
            <Col className="d-flex">
              <FormGroup controlId="paymentMethod" as={BorderFeedback}>
                <FormLabel>Frazionamento del premio</FormLabel>
                <FieldError />
                <CheckGroup
                  type="radio-switch"
                  options={paymentMethodsOptions(premium, paymentMethodValue)}
                  validation={{
                    required: "Seleziona un frazionamento di pagamento",
                  }}
                />
              </FormGroup>
            </Col>
            <h4>Dati bancari del contraente</h4>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="contractorFullName" as={BorderFeedback}>
                <FormLabel>Intestatario c/c</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Intestatario c/c"
                  readOnly
                  plaintext
                />
              </FormGroup>
            </Col>
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
              <FormGroup controlId="bicSwift" as={BorderFeedback}>
                <FormLabel>BIC/SWIFT</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="BIC/SWIFT"
                  validation={{
                    required: "Inserisci il BIC/SWIFT",
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
                  placeholder="IT60X0542811101000000123456"
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
                  normalize={upperCaseNormalizer}
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
          Salva e Prosegui
        </Button>
      </ModalFooter>
    </>
  );
}
