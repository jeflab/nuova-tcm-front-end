"use client";

import {updatePaymentData} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
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
import {Currency} from "@/ui/Currency";
import {toCurrency} from "@/helpers/numbers";

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
  const lipId = useStore((state) => state.lip?.id);
  const birthDate = useStore((state) => state.lip?.contractor.birthDate)!;
  const contractorName = useStore((state) => state.lip?.contractor.name);
  const contractorSurname = useStore((state) => state.lip?.contractor.surname);
  const paymentData = useStore((state) => state.lip?.payment);

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

  const closeModal = useStore((state) => state.closeModal);
  const premium = useStore((state) => state.lip?.quotation?.premium)!;
  const extraPremium = useStore(
    (state) => state.lip?.quotation?.underwriting?.extraPremium?.value,
  );
  const realPremium = extraPremium ?? premium;

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

            if (updatedContractor.status !== "success") {
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
              <Alert variant="info" className="mb-0">
                <p>
                  Il{" "}
                  <strong>Contratto si intende perfezionato e concluso</strong>{" "}
                  nel momento in cui avvengono contestualmente tutti gli eventi
                  qui elencati:
                </p>
                <ol type="a">
                  <li>
                    la{" "}
                    <strong>
                      sottoscrizione della proposta/polizza da parte del
                      Contraente
                    </strong>
                    ;
                  </li>
                  <li>
                    il <strong>pagamento del Premio</strong> Annuo Costante o
                    rata di Premio alla data di perfezionamento;
                  </li>
                  <li>
                    la ricezione da parte del Contraente della comunicazione
                    scritta di{" "}
                    <strong>
                      accettazione della Proposta da parte della Compagnia
                    </strong>
                    .
                  </li>
                </ol>
                <p className="mb-0">
                  Il contratto entra in vigore (Decorrenza) alle ore 24 della
                  data di perfezionamento e conclusione dello stesso.
                </p>
              </Alert>
            </Col>
            {extraPremium &&
            toCurrency(extraPremium) !== toCurrency(premium) ? (
              <Col className="col-12">
                <Alert variant="warning" className="mb-0">
                  In seguito a underwriting si applica il premio di{" "}
                  <Currency>{extraPremium}</Currency> anziché di{" "}
                  <Currency>{premium}</Currency>.
                </Alert>
              </Col>
            ) : null}
            <Col className="d-flex">
              <FormGroup controlId="paymentMethod" as={BorderFeedback}>
                <FormLabel>Frazionamento del premio</FormLabel>
                <FieldError />
                <CheckGroup
                  type="radio-switch"
                  options={paymentMethodsOptions(realPremium)}
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
