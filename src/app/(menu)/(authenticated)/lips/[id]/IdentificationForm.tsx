"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {dbDateString} from "@/helpers/dates";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckboxField} from "@/ui/form/CheckboxField";
import {DropzoneField} from "@/ui/form/DropzoneField";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {SelectField} from "@/ui/form/SelectField";
import {
  faCreditCard,
  faIdCard,
  faSave,
  faSpinner,
  faXmark,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  Button,
  Col,
  FormGroup,
  FormLabel,
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
    (state) => state.updateIdentificationData,
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
                <FormLabel>Tipo di documento</FormLabel>
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
                <FormLabel>Numero documento</FormLabel>
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
                <FormLabel>Rilasciato da</FormLabel>
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
                <FormLabel>Data di rilascio</FormLabel>
                <FieldError />
                <InputField
                  type="date"
                  placeholder="Data di rilascio"
                  max={dbDateString()}
                  validation={{
                    required: "Inserisci la data di rilascio",
                    max: {
                      value: dbDateString(),
                      message: "La data di rilascio non può essere nel futuro",
                    },
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="expiringDate" as={BorderFeedback}>
                <FormLabel>Data di scadenza</FormLabel>
                <FieldError />
                <InputField
                  type="date"
                  placeholder="Data di scadenza"
                  min={dbDateString()}
                  validation={{
                    min: {
                      value: dbDateString(),
                      message: "La data di scadenza non può essere nel passato",
                    },
                    required: "Inserisci la data di scadenza",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="frontPicture" as={BorderFeedback}>
                <FormLabel>Documento fronte</FormLabel>
                <FieldError />
                <DropzoneField
                  validation={{
                    required: "Carica la foto del fronte del documento",
                  }}
                >
                  <p className="mb-0">
                    Trascina il file qui, oppure clicca per cercare il file sul
                    tuo computer
                  </p>
                  <FontAwesomeIcon icon={faIdCard} size="5x" />
                </DropzoneField>
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="backPicture" as={BorderFeedback}>
                <FormLabel>Documento retro</FormLabel>
                <FieldError />
                <DropzoneField
                  validation={{
                    required: "Carica la foto del retro del documento",
                  }}
                >
                  <p className="mb-0">
                    Trascina il file qui, oppure clicca per cercare il file sul
                    tuo computer
                  </p>
                  <FontAwesomeIcon icon={faCreditCard} size="5x" />
                </DropzoneField>
              </FormGroup>
            </Col>{" "}
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
