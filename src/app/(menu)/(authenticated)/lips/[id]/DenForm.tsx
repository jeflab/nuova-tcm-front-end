"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckboxField} from "@/ui/form/CheckboxField";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {SelectField} from "@/ui/form/SelectField";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  Button,
  Col,
  FormGroup,
  ModalBody,
  ModalFooter,
  Row,
} from "react-bootstrap";
import {useForm} from "react-hook-form";

const idTypeOptions = [
  {label: "Passaporto", value: "passport"},
  {label: "Carta d'identità", value: "identity_card"},
  {label: "Patente", value: "driving_license"},
  {label: "Altro", value: "other"},
] as const;
export const getTypeLabel = (type: IdType) =>
  idTypeOptions.find((t) => t.value === type)?.label;
export type IdType = (typeof idTypeOptions)[number]["value"];

const identificationDefaultValues = {
  idType: "" as IdType,
  number: "",
  issuedBy: "",
  issuedDate: "",
  expiringDate: "",
  frontPicture: "",
  backPicture: "",
  metContractorInPerson: false,
  documentIsCopyShownByContractor: false,
  photoIsOfContractor: false,
  contractorHasBeenIdentified: false,
};

export function IdentificationForm() {
  const formMethods = useForm({
    mode: "onChange",
    defaultValues: identificationDefaultValues,
  });

  const closeModal = useDrawerStore((state) => state.closeModal);
  const updateIdentification = useDrawerStore(
    (state) => state.updateIdentification,
  );

  return (
    <>
      <ModalBody>
        <Form
          id="identification-form"
          onSubmit={(values) => {
            updateIdentification(values);
            closeModal();
          }}
          formMethods={formMethods}
          className="vstack gap-3"
        >
          <Row className="row-gap-3">
            <h4>Documento d'identità:</h4>
            <Col className="d-flex" xs={12}>
              <FormGroup controlId="idType" as={BorderFeedback}>
                <p className="mb-2 input-heading">Tipo di documento</p>
                <FieldError />
                <SelectField
                  options={idTypeOptions}
                  placeholder="Seleziona il tipo di documento"
                  validation={{
                    required: "Seleziona il tipo di documento",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="number" as={BorderFeedback}>
                <p className="mb-2 input-heading">Numero documento</p>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Numero documento"
                  validation={{
                    required: "Inserisci il numero del documento",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="issuedBy" as={BorderFeedback}>
                <p className="mb-2 input-heading">Rilasciato da</p>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Rilasciato da"
                  validation={{
                    required: "Inserisci l'ente di rilascio",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="issuedDate" as={BorderFeedback}>
                <p className="mb-2 input-heading">Data di rilascio</p>
                <FieldError />
                <InputField
                  type="date"
                  placeholder="Data di rilascio"
                  validation={{
                    required: "Inserisci la data di rilascio",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="expiringDate" as={BorderFeedback}>
                <p className="mb-2 input-heading">Data di scadenza</p>
                <FieldError />
                <InputField
                  type="date"
                  placeholder="Data di scadenza"
                  validation={{
                    required: "Inserisci la data di scadenza",
                  }}
                />
              </FormGroup>
            </Col>
            <h4>Il contraente dichiara:</h4>
            <Col xs={12}>
              <FormGroup
                controlId="metContractorInPerson"
                as={BorderFeedback}
                className="position-relative"
              >
                <FieldError />
                <CheckboxField
                  type="checkbox"
                  label="Di aver incontrato il contraente di persona"
                  validation={{
                    required:
                      "Per procedere devi dichiarare di aver incontrato il contraente di persona",
                  }}
                  stretchedLabel
                />
              </FormGroup>
            </Col>
            <Col xs={12}>
              <FormGroup
                controlId="documentIsCopyShownByContractor"
                as={BorderFeedback}
                className="position-relative"
              >
                <FieldError />
                <CheckboxField
                  type="checkbox"
                  label="Che il documento è la copia di quello mostrato dal contraente"
                  validation={{
                    required:
                      "Per procedere devi dichiarare che il documento è la copia di quello mostrato dal contraente",
                  }}
                  stretchedLabel
                />
              </FormGroup>
            </Col>
            <Col xs={12}>
              <FormGroup
                controlId="photoIsOfContractor"
                as={BorderFeedback}
                className="position-relative"
              >
                <FieldError />
                <CheckboxField
                  type="checkbox"
                  label="Che la fotografia è del contraente"
                  validation={{
                    required:
                      "Per procedere devi dichiarare che la fotografia è del contraente",
                  }}
                  stretchedLabel
                />
              </FormGroup>
            </Col>
            <Col xs={12}>
              <FormGroup
                controlId="contractorHasBeenIdentified"
                as={BorderFeedback}
                className="position-relative"
              >
                <FieldError />
                <CheckboxField
                  type="checkbox"
                  label="Di aver identificato il contraente"
                  validation={{
                    required:
                      "Per procedere devi dichiarare di aver identificato il contraente",
                  }}
                  stretchedLabel
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
        <Button type="submit" variant="primary" form="identification-form">
          {formMethods.formState.isSubmitting ? (
            <FontAwesomeIcon icon={faSpinner} className="fa-spin me-2" />
          ) : (
            <FontAwesomeIcon icon={faSave} className="me-2" />
          )}
          Salva e prosegui
        </Button>
      </ModalFooter>
    </>
  );
}
