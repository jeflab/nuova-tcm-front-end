"use client";

import {identificationContractor} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {
  getIdentityDocumentDefaultValues,
  IdentityDocumentForm,
} from "@/app/(menu)/(authenticated)/lipsDrawers/IdentityDocumentForm";
import {createIDImageUrl} from "@/helpers/createResourcesUrl";
import {normalizeError} from "@/helpers/errors";
import {getTypedFormDataFromObject} from "@/helpers/typedFormData";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckboxField} from "@/ui/form/CheckboxField";
import {FieldError} from "@/ui/form/FieldError";
import {FileDropzoneField} from "@/ui/form/FileDropzoneField";
import {Form} from "@/ui/form/Form";
import {HelpText} from "@/ui/form/HelpText";
import {ImageDropzoneField} from "@/ui/form/ImageDropzoneField";
import {
  faCreditCard,
  faIdCard,
  faSave,
  faSpinner,
  faXmark,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import omit from "lodash/omit";
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

export function IdentificationForm() {
  const agentId = useStore((state) => state.lip?.agent.id);
  const contractorId = useStore((state) => state.lip?.contractor.id);
  const identityDocument = useStore((state) =>
    state.lip?.contractor.identityDocument?.at(-1),
  );
  const lipSalesMode = useStore((state) => state.lip?.salesMode);

  const existingResidenceProofUrl =
    identityDocument?.identification?.fileResidenceProofName;

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: {
      ...getIdentityDocumentDefaultValues(
        identityDocument,
        lipSalesMode === "remote",
      ),
      frontPicture: null as unknown as File,
      backPicture: null as unknown as File,
      residenceProof: null as unknown as File,
      metContractorInPerson: !!identityDocument,
      documentIsCopyShownByContractor: !!identityDocument,
      photoIsOfContractor: !!identityDocument,
      contractorHasBeenIdentified: !!identityDocument,
      residenceProofProvidedLater:
        !!identityDocument &&
        lipSalesMode === "remote" &&
        !existingResidenceProofUrl,
    },
  });

  const fiscalCode = useStore((state) => state.lip?.contractor?.fiscalCode);
  const lipId = useStore((state) => state.lip?.id);
  const closeModal = useStore((state) => state.closeModal);

  const existingFrontImageUrl = createIDImageUrl({
    personalDataId: contractorId,
    agentId,
    fileName: identityDocument?.identification?.fileIdFrontName,
    size: "full",
  });

  const existingBackImageUrl = createIDImageUrl({
    personalDataId: contractorId,
    agentId,
    fileName: identityDocument?.identification?.fileIdBackName,
    size: "full",
  });

  const residenceProofValue = formMethods.getValues("residenceProof");
  const residenceProofProvidedLaterValue = formMethods.getValues(
    "residenceProofProvidedLater",
  );

  return (
    <>
      <ModalBody>
        <Form
          id="identification-form"
          onSubmit={async (values) => {
            invariant(fiscalCode, "Fiscal code is required");
            invariant(lipId, "lipId is required");
            let identificationContractorResponse;

            try {
              identificationContractorResponse = await identificationContractor(
                getTypedFormDataFromObject(
                  omit(values, [
                    "metContractorInPerson",
                    "documentIsCopyShownByContractor",
                    "photoIsOfContractor",
                    "contractorHasBeenIdentified",
                    "residenceProofProvidedLater",
                  ]),
                ),
                fiscalCode,
                lipId,
              );
            } catch (e) {
              throw {
                root: {
                  type: "server",
                  message: normalizeError(e).message,
                },
              };
            }

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
            <IdentityDocumentForm
              onlyIdentityCard={lipSalesMode === "remote"}
            />
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
            </Col>
            <h4>Conferma residenza:</h4>
            <Col xs={12}>
              <Alert variant="info">
                Si ricorda che è <strong>obbligatorio</strong> fornire un
                documento che certifichi la residenza del contraente nei seguiti
                casi:
                <ol>
                  <li>
                    se l’indirizzo di residenza indicato in proposta NON
                    coincide con quello presente sul documento di identità del
                    Contraente;
                  </li>
                  <li>
                    se è stato caricato un documento di identificazione DIVERSO
                    dalla carta di identità;
                  </li>
                  <li>
                    in caso di <strong>vendita a distanza</strong>.
                  </li>
                </ol>
                Può essere caricato uno dei seguenti documenti:
                <ul className="mb-0">
                  <li>
                    Bolletta delle utenze domestiche (energia elettrica, gas,
                    acqua, telefono, internet etc.) intestata al Contraente;
                  </li>
                  <li>Estratto conto bancario del Contraente;</li>
                  <li>
                    Qualsiasi bollettino di pagamento (es. tassa rifiuti,
                    sanzioni stradali etc.) intestato al Contraente;
                  </li>
                  <li>Il certificato di residenza del Contraente.</li>
                </ul>
              </Alert>
              <FormGroup controlId="residenceProof" as={BorderFeedback}>
                <FormLabel>Documento a conferma della residenza</FormLabel>
                <FieldError />
                <FileDropzoneField
                  preselectedFileName={existingResidenceProofUrl}
                  onChange={() => {
                    setTimeout(() => {
                      formMethods.setValue(
                        "residenceProofProvidedLater",
                        false,
                        {shouldValidate: true},
                      );
                    }, 0);
                  }}
                  validation={{
                    validate: {
                      required: (value) => {
                        if (
                          !residenceProofProvidedLaterValue &&
                          lipSalesMode === "remote" &&
                          !value &&
                          !existingResidenceProofUrl
                        ) {
                          return "Carica un documento a conferma della residenza";
                        }
                      },
                    },
                  }}
                >
                  <p className="mb-0">
                    Trascina il file qui, oppure clicca per cercare il file sul
                    tuo computer
                  </p>
                </FileDropzoneField>
              </FormGroup>
            </Col>
            {lipSalesMode === "remote" && (
              <Col xs={12}>
                <Alert variant="warning">
                  Il documento può essere fornito anche successivamente al
                  completamento della proposta MA è requisito essenziale per
                  l’accettazione della stessa.
                </Alert>
                <FormGroup
                  controlId="residenceProofProvidedLater"
                  as={BorderFeedback}
                  className="position-relative"
                >
                  <FieldError />
                  <CheckboxField
                    type="checkbox"
                    label="L'Intermediario dichiara che l documento verrà fornito successivamente"
                    disabled={
                      !!existingResidenceProofUrl || !!residenceProofValue
                    }
                    onChange={() => {
                      setTimeout(() => {
                        formMethods.trigger("residenceProof");
                      }, 0);
                    }}
                    validation={{
                      required:
                        lipSalesMode === "remote" &&
                        !(residenceProofValue || existingResidenceProofUrl) &&
                        "Per procedere devi caricare un documento a conferma della residenza o dichiarare che verrà fornito successivamente",
                    }}
                    stretchedLabel
                  />
                </FormGroup>
              </Col>
            )}
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
                  label={
                    lipSalesMode === "remote"
                      ? "Di aver identificato il Contraente a distanza"
                      : "Di aver incontrato il Contraente di persona"
                  }
                  validation={{
                    required:
                      lipSalesMode === "remote"
                        ? "Per procedere devi dichiarare di aver identificato il Contraente a distanza"
                        : "Per procedere devi dichiarare di aver incontrato il Contraente di persona",
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
