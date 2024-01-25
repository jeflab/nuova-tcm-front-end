"use client";

import {contractorGenders} from "@/app/(menu)/(authenticated)/lips/[id]/ContractorFiscalCodeForm";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {cns} from "@/helpers/cns";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {ComuneProvAutocompleteField} from "@/ui/form/ComuneProvAutocompleteField";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  Alert,
  Button,
  Col,
  FormGroup,
  FormLabel,
  ModalBody,
  ModalFooter,
  Row,
} from "react-bootstrap";
import {useForm} from "react-hook-form";

const contractorDataDefaultValues = {
  residence: {
    place: {
      city: "",
      province: "",
    },
    streetName: "",
    streetNumber: "",
    zipCode: "",
  },
};

export function ContractorDataForm() {
  const formMethods = useForm({
    mode: "onChange",
    defaultValues: contractorDataDefaultValues,
  });

  const contractorFiscalCodeData = useDrawerStore(
    (state) => state.lipData.contractorFiscalCode,
  );
  const closeModal = useDrawerStore((state) => state.closeModal);

  return (
    <>
      <ModalBody>
        <Form
          onSubmit={async (values) => {
            console.log(values);
          }}
          id="contractor-fiscal-code-form"
          formMethods={formMethods}
        >
          <Row className="row-gap-3">
            <h4 className="w-100">Anagrafica</h4>
            <Col xs={12}>
              <FormGroup controlId="fiscalCode" as={BorderFeedback}>
                <FormLabel>Codice Fiscale</FormLabel>
                <InputField
                  type="text"
                  plaintext
                  readOnly
                  defaultValue={contractorFiscalCodeData?.fiscalCode}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} lg={5}>
              <FormGroup controlId="surname" as={BorderFeedback}>
                <FormLabel>Cognome</FormLabel>
                <InputField
                  type="text"
                  plaintext
                  readOnly
                  defaultValue={contractorFiscalCodeData?.surname}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} lg={5}>
              <FormGroup controlId="name" as={BorderFeedback}>
                <FormLabel>Nome</FormLabel>
                <InputField
                  type="text"
                  plaintext
                  readOnly
                  defaultValue={contractorFiscalCodeData?.name}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} md={3} lg={2}>
              <FormGroup controlId="gender" as={BorderFeedback}>
                <FormLabel>Genere</FormLabel>
                <CheckGroup
                  type="radio"
                  options={contractorGenders}
                  readOnly
                  defaultValue={contractorFiscalCodeData?.gender}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} md={4} lg={5}>
              <FormGroup controlId="birthDate" as={BorderFeedback}>
                <FormLabel>Data di nascita</FormLabel>
                <InputField
                  type="date"
                  plaintext
                  readOnly
                  defaultValue={contractorFiscalCodeData?.birthDate}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} md={5} lg={7}>
              <FormGroup controlId="birthPlace" as={BorderFeedback}>
                <FormLabel>Luogo di nascita</FormLabel>
                <ComuneProvAutocompleteField
                  plaintext
                  readOnly
                  defaultValue={contractorFiscalCodeData?.birthPlace}
                />
              </FormGroup>
            </Col>
            <h4 className="w-100">Contatti</h4>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="phone" as={BorderFeedback}>
                <FormLabel>Cellulare</FormLabel>
                <InputField
                  type="text"
                  plaintext
                  readOnly
                  defaultValue={contractorFiscalCodeData?.phone}
                />
              </FormGroup>
            </Col>{" "}
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="email" as={BorderFeedback}>
                <FormLabel>E-mail</FormLabel>
                <InputField
                  type="text"
                  plaintext
                  readOnly
                  defaultValue={contractorFiscalCodeData?.email}
                />
              </FormGroup>
            </Col>
            <h4 className="w-100">Residenza</h4>
            <Col className="d-flex" xs={12} md={9}>
              <FormGroup controlId="residence.streetName" as={BorderFeedback}>
                <FormLabel>Indirizzo</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Indirizzo"
                  validation={{
                    required: "Inserisci l'indirizzo del contraente",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} md={3}>
              <FormGroup controlId="residence.streetNumber" as={BorderFeedback}>
                <FormLabel>N° civico</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="N° civico"
                  validation={{
                    required: "Inserisci l'indirizzo del contraente",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} md={9}>
              <FormGroup controlId="residence.place" as={BorderFeedback}>
                <FormLabel>Città</FormLabel>
                <FieldError name="residence.place.city" />
                <FieldError
                  name="residence.place.province"
                  disableIf={["residence.place.city"]}
                />
                <ComuneProvAutocompleteField onlyExisting />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} md={3}>
              <FormGroup controlId="residence.zipCode" as={BorderFeedback}>
                <FormLabel>CAP</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="CAP"
                  validation={{
                    required: "Inserisci l'indirizzo del contraente",
                    minLength: {
                      value: 5,
                      message: "Il CAP deve essere di 5 caratteri",
                    },
                    maxLength: {
                      value: 5,
                      message: "Il CAP deve essere di 5 caratteri",
                    },
                  }}
                  normalize={(value) => value.replace(/\D/g, "")}
                />
              </FormGroup>
            </Col>
            <Col>
              <FieldError
                name="root"
                as={Alert}
                variant="danger"
                className="mb-0 w-100 px-3"
              />
            </Col>
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="cancel" onClick={() => closeModal()}>
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          Annulla
        </Button>
        <Button
          type="submit"
          variant="primary"
          form="contractor-fiscal-code-form"
        >
          <FontAwesomeIcon
            icon={formMethods.formState.isSubmitting ? faSpinner : faSave}
            className={cns(
              "me-2",
              formMethods.formState.isSubmitting && "fa-spin",
            )}
          />
          Salva e prosegui
        </Button>
      </ModalFooter>
    </>
  );
}
