"use client";

import {normalizeError} from "@/helpers/errors";
import {HelpText} from "@/ui/form/HelpText";
import omit from "lodash/omit";
import {identificationInsured} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {
  getIdentityDocumentDefaultValues,
  IdentityDocumentForm,
} from "@/app/(menu)/(authenticated)/lipsDrawers/IdentityDocumentForm";
import {createIDImageUrl} from "@/helpers/createResourcesUrl";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckboxField} from "@/ui/form/CheckboxField";
import {ImageDropzoneField} from "@/ui/form/ImageDropzoneField";
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

export function InsuredIdentificationForm() {
  const agentId = useStore((state) => state.lip?.agent.id);
  const insuredId = useStore((state) => state.lip?.insured?.id);
  const identityDocument = useStore((state) =>
    state.lip?.insured?.identityDocument?.at(-1),
  );

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: {
      ...getIdentityDocumentDefaultValues(identityDocument),
      frontPicture: null as unknown as File,
      backPicture: null as unknown as File,
      metInsuredInPerson: !!identityDocument,
      documentIsCopyShownByInsured: !!identityDocument,
      photoIsOfInsured: !!identityDocument,
      insuredHasBeenIdentified: !!identityDocument,
    },
  });

  const fiscalCode = useStore((state) => state.lip?.insured?.fiscalCode);
  const lipId = useStore((state) => state.lip?.id);
  const closeModal = useStore((state) => state.closeModal);

  const existingFrontImageUrl = createIDImageUrl({
    personalDataId: insuredId,
    agentId,
    fileName: identityDocument?.identification?.fileIdFrontName,
    size: "full",
  });

  const existingBackImageUrl = createIDImageUrl({
    personalDataId: insuredId,
    agentId,
    fileName: identityDocument?.identification?.fileIdBackName,
    size: "full",
  });

  return (
    <>
      <ModalBody>
        <Form
          id="insured-identification-form"
          onSubmit={async (values) => {
            invariant(fiscalCode, "Fiscal code is required");
            invariant(lipId, "lipId is required");

            const identificationInsuredResponse = await identificationInsured(
              getTypedFormDataFromObject(
                omit(values, [
                  "metInsuredInPerson",
                  "documentIsCopyShownByInsured",
                  "photoIsOfInsured",
                  "insuredHasBeenIdentified",
                ]),
              ),
              fiscalCode,
              lipId,
            );

            if (identificationInsuredResponse?.status !== "success") {
              throw {
                root: {
                  type: "server",
                  message: normalizeError(identificationInsuredResponse)
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
                <ImageDropzoneField
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
                </ImageDropzoneField>
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
                <ImageDropzoneField
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
                </ImageDropzoneField>
              </FormGroup>
            </Col>{" "}
            <h4>L'Intermediario dichiara:</h4>
            <Col xs={12}>
              <FormGroup
                controlId="metInsuredInPerson"
                as={BorderFeedback}
                className="position-relative"
              >
                <FieldError />
                <CheckboxField
                  type="checkbox"
                  label="Di aver incontrato l'Assicurato di persona"
                  validation={{
                    required:
                      "Per procedere devi dichiarare di aver incontrato l'Assicurato di persona",
                  }}
                  stretchedLabel
                />
              </FormGroup>
            </Col>
            <Col xs={12}>
              <FormGroup
                controlId="documentIsCopyShownByInsured"
                as={BorderFeedback}
                className="position-relative"
              >
                <FieldError />
                <CheckboxField
                  type="checkbox"
                  label="Che il documento è la copia di quello mostrato all'Assicurato"
                  validation={{
                    required:
                      "Per procedere devi dichiarare che il documento è la copia di quello mostrato all'Assicurato",
                  }}
                  stretchedLabel
                />
              </FormGroup>
            </Col>
            <Col xs={12}>
              <FormGroup
                controlId="photoIsOfInsured"
                as={BorderFeedback}
                className="position-relative"
              >
                <FieldError />
                <CheckboxField
                  type="checkbox"
                  label="Che la fotografia è dell'Assicurato"
                  validation={{
                    required:
                      "Per procedere devi dichiarare che la fotografia è dell'Assicurato",
                  }}
                  stretchedLabel
                />
              </FormGroup>
            </Col>
            <Col xs={12}>
              <FormGroup
                controlId="insuredHasBeenIdentified"
                as={BorderFeedback}
                className="position-relative"
              >
                <FieldError />
                <CheckboxField
                  type="checkbox"
                  label="Di aver identificato l'Assicurato"
                  validation={{
                    required:
                      "Per procedere devi dichiarare di aver identificato l'Assicurato",
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
        <Button
          type="submit"
          variant="primary"
          form="insured-identification-form"
        >
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
