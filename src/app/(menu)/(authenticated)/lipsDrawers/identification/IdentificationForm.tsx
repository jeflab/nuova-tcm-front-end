"use client";

import {normalizeError} from "@/helpers/errors";
import {HelpText} from "@/ui/form/HelpText";
import omit from "lodash/omit";
import {identificationContractor} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {
  getIdentityDocumentDefaultValues,
  IdentityDocumentForm,
} from "@/app/(menu)/(authenticated)/lipsDrawers/IdentityDocumentForm";
import {createIDImageUrl} from "@/helpers/createResourcesUrl";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckboxField} from "@/ui/form/CheckboxField";
import {DropzoneField} from "@/ui/form/DropzoneField";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {
  faCreditCard,
  faIdCard,
  faSave,
  faSpinner,
  faXmark,
} from "@fortawesome/pro-duotone-svg-icons";
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
import invariant from "tiny-invariant";
import {getTypedFormDataFromObject} from "@/helpers/typedFormData";

export function IdentificationForm() {
  const agentId = useStore((state) => state.lip?.agent.id);
  const contractorId = useStore((state) => state.lip?.contractor.id);
  const identityDocument = useStore((state) =>
    state.lip?.contractor.identityDocument?.at(-1),
  );

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: {
      ...getIdentityDocumentDefaultValues(identityDocument),
      frontPicture: null as unknown as File,
      backPicture: null as unknown as File,
      metContractorInPerson: !!identityDocument,
      documentIsCopyShownByContractor: !!identityDocument,
      photoIsOfContractor: !!identityDocument,
      contractorHasBeenIdentified: !!identityDocument,
    },
  });

  const fiscalCode = useStore((state) => state.lip?.contractor?.fiscalCode);
  const lipId = useStore((state) => state.lip?.id);
  const closeModal = useStore((state) => state.closeModal);

  const existingFrontImageUrl = createIDImageUrl({
    contractorId,
    agentId,
    fileName: identityDocument?.identification?.fileIdFrontName,
    size: "full",
  });

  const existingBackImageUrl = createIDImageUrl({
    contractorId,
    agentId,
    fileName: identityDocument?.identification?.fileIdBackName,
    size: "full",
  });

  return (
    <>
      <ModalBody>
        <Form
          id="identification-form"
          onSubmit={async (values) => {
            invariant(fiscalCode, "Fiscal code is required");
            invariant(lipId, "lipId is required");

            const identificationContractorResponse =
              await identificationContractor(
                getTypedFormDataFromObject(
                  omit(values, [
                    "metContractorInPerson",
                    "documentIsCopyShownByContractor",
                    "photoIsOfContractor",
                    "contractorHasBeenIdentified",
                  ]),
                ),
                fiscalCode,
                lipId,
              );

            if (identificationContractorResponse?.status !== "success") {
              throw {
                root: {
                  type: "server",
                  message: normalizeError(identificationContractorResponse)
                    .message,
                },
              };
            }

            closeModal();
          }}
          formMethods={formMethods}
          className="vstack gap-3"
        >
          <Row className="row-gap-3">
            <h4>Documento d'identità:</h4>
            <IdentityDocumentForm />
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="frontPicture" as={BorderFeedback}>
                <FormLabel>Documento fronte</FormLabel>
                <HelpText>
                  Importante! Il documento deve essere ben leggibile. Caricare
                  una foto del documento in primo piano e orizzontale, in modo
                  che riempia lo spazio disponibile.
                </HelpText>
                <FieldError />
                <DropzoneField
                  preselectedImageUrl={existingFrontImageUrl}
                  validation={{
                    validate: {
                      required: (value) => {
                        if (!value && !existingFrontImageUrl) {
                          return "Carica la foto del retro del documento";
                        }
                      },
                    },
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
                <HelpText>
                  Importante! Il documento deve essere ben leggibile. Caricare
                  una foto del documento in primo piano e orizzontale, in modo
                  che riempia lo spazio disponibile.
                </HelpText>
                <FieldError />
                <DropzoneField
                  preselectedImageUrl={existingBackImageUrl}
                  validation={{
                    validate: {
                      required: (value) => {
                        if (!value && !existingBackImageUrl) {
                          return "Carica la foto del retro del documento";
                        }
                      },
                    },
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
            <h4>L'Intermediario dichiara:</h4>
            <Col xs={12}>
              <FormGroup
                controlId="metContractorInPerson"
                as={BorderFeedback}
                className="position-relative"
              >
                <FieldError />
                <CheckboxField
                  type="checkbox"
                  label="Di aver incontrato il Contraente di persona"
                  validation={{
                    required:
                      "Per procedere devi dichiarare di aver incontrato il Contraente di persona",
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
                  label="Che il documento è la copia di quello mostrato dal Contraente"
                  validation={{
                    required:
                      "Per procedere devi dichiarare che il documento è la copia di quello mostrato dal Contraente",
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
                  label="Che la fotografia è del Contraente"
                  validation={{
                    required:
                      "Per procedere devi dichiarare che la fotografia è del Contraente",
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
                  label="Di aver identificato il Contraente"
                  validation={{
                    required:
                      "Per procedere devi dichiarare di aver identificato il Contraente",
                  }}
                  stretchedLabel
                />
              </FormGroup>
            </Col>
          </Row>
          <FieldError
            name="root"
            as={Alert}
            variant="danger"
            className="mb-0 w-100 px-3"
          />
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
