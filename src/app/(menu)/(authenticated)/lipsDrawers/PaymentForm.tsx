"use client";

import {updatePaymentData} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {
  PaymentMethods,
  paymentMethodsOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {getCoverageDuration} from "@/app/(menu)/(authenticated)/quoter/helpers";
import {Lip} from "@/models/entities/lip";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {HelpText} from "@/ui/form/HelpText";
import {InputField} from "@/ui/form/InputField";
import {upperCaseNormalizer} from "@/ui/form/normalizers";
import {validateIBAN} from "@/ui/form/validators/iban";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {addYears} from "date-fns/addYears";
import {
  Alert,
  Button,
  Col,
  FormGroup,
  FormLabel,
  InputGroup,
  ModalBody,
  ModalFooter,
  Row,
} from "react-bootstrap";
import {useForm} from "react-hook-form";
import invariant from "tiny-invariant";

const paymentDefaultValues = (paymentData?: Lip["payment"]) => ({
  effectiveDate: paymentData?.effectiveDate ?? "",
  duration: paymentData?.duration ?? "",
  expirationDate: paymentData?.expirationDate ?? "",
  paymentMethod: paymentData?.paymentMethod ?? ("" as PaymentMethods),
  contractorFullName: paymentData?.contractorFullName ?? "",
  jointOwners: paymentData?.jointOwners ?? "",
  bank: paymentData?.bank ?? "",
  bicSwift: paymentData?.bicSwift ?? "",
  iban: paymentData?.iban?.replace(/^IT/, "") ?? "",
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

  return (
    <>
      <ModalBody>
        <Form
          id="payment-form"
          onSubmit={async (values) => {
            invariant(lipId, "lipId is required");

            const updatedContractor = await updatePaymentData(
              {...values, iban: "IT" + values.iban},
              lipId,
            );

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
            <Col className="col-12">
              <Alert variant="info">
                <p>
                  Il contratto si intende{" "}
                  <strong>perfezionato e concluso</strong> nel momento in cui
                  avvengono entrambi gli eventi qui elencati:
                </p>
                <ol>
                  <li>
                    la <strong>sottoscrizione della proposta/polizza</strong> da
                    parte del Contraente
                  </li>
                  <li>
                    il <strong>pagamento del Premio Annuo Costante</strong> alla
                    data di perfezionamento.
                  </li>
                </ol>
                <p className="mb-0">
                  Il contratto entra in vigore alle ore 24 della data di
                  perfezionamento e conclusione dello stesso.
                </p>
              </Alert>
            </Col>
            <Col className="d-flex">
              <FormGroup controlId="paymentMethod" as={BorderFeedback}>
                <FormLabel>Frazionamento del premio</FormLabel>
                <FieldError />
                <CheckGroup
                  type="radio-switch"
                  options={paymentMethodsOptions(premium)}
                  validation={{
                    required: "Seleziona un frazionamento di pagamento",
                  }}
                />
              </FormGroup>
            </Col>
            <h4>Dati bancari del Contraente</h4>
            <Col className="d-flex" xs={12} sm={3}>
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
            <Col className="d-flex" xs={12} sm={5}>
              <FormGroup controlId="jointOwners" as={BorderFeedback}>
                <FormLabel>Eventuali cointestatari c/c</FormLabel>
                <HelpText>
                  Indicare nomi e cognomi degli eventuali cointestatari del
                  conto corrente separati da una virgola.
                </HelpText>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Eventuali cointestatari c/c"
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={4}>
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
                <InputGroup>
                  <InputGroup.Text>IT</InputGroup.Text>
                  <InputField
                    type="text"
                    placeholder="60X0542811101000000123456"
                    validation={{
                      validate: {
                        required: (value) => {
                          if (!value) {
                            return "Inserisci l'IBAN del Contraente";
                          }
                        },
                        format: (value) => {
                          if (!validateIBAN("IT" + value)) {
                            return "Inserisci un IBAN valido";
                          }
                        },
                      },
                    }}
                    normalize={upperCaseNormalizer}
                  />
                </InputGroup>
              </FormGroup>
            </Col>
          </Row>
          <FieldError name="root" as={Alert} variant="danger" />
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
