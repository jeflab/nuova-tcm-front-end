"use client";

import {useIdentificationInsured} from "@/app/(menu)/(authenticated)/lips/[id]/mutations";
import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {
  getIdentityDocumentDefaultValues,
  IdentityDocumentForm,
} from "@/app/(menu)/(authenticated)/lipsDrawers/IdentityDocumentForm";
import {isInsuredDataValid} from "@/app/(menu)/(authenticated)/lipsDrawers/insuredData/insuredDataValidators";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
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
import {useDrawerModal} from "@/ui/ModalContext";
import {
  faCreditCard,
  faIdCard,
  faSave,
  faSpinner,
  faXmark,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSuspenseQuery} from "@tanstack/react-query";
import omit from "lodash/omit";
import {useParams} from "next/navigation";
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

export function InsuredIdentificationForm() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id) as number;
  const {
    data: {lip},
  } = useSuspenseQuery(getLipQuery(lipId));
  const {closeModal} = useDrawerModal();
  const {mutateAsync: identificationInsured} = useIdentificationInsured();

  if (!isInsuredDataValid(lip)) {
    throw new Error("Lip non valida per l'identificazione dell'assicurato");
  }

  const identityDocument = lip.insured.identityDocument?.at(-1);
  const existingResidenceProofUrl =
    identityDocument?.identification?.fileResidenceProofName;

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: {
      ...getIdentityDocumentDefaultValues(
        identityDocument,
        lip.salesMode === "remote",
      ),
      frontPicture: null as unknown as File,
      backPicture: null as unknown as File,
      residenceProof: null as unknown as File,
      metInsuredInPerson: !!identityDocument,
      documentIsCopyShownByInsured: !!identityDocument,
      photoIsOfInsured: !!identityDocument,
      insuredHasBeenIdentified: !!identityDocument,
      residenceProofProvidedLater:
        !!identityDocument &&
        lip.salesMode === "remote" &&
        !existingResidenceProofUrl,
    },
  });

  const existingFrontImageUrl = createIDImageUrl({
    personalDataId: lip.insured.id,
    agentId: lip.agent.id,
    fileName: identityDocument?.identification?.fileIdFrontName,
    size: "full",
  });

  const existingBackImageUrl = createIDImageUrl({
    personalDataId: lip.insured.id,
    agentId: lip.agent.id,
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
          id="insured-identification-form"
          onSubmit={async (values) => {
            try {
              await identificationInsured({
                lipId: lip.id,
                formData: getTypedFormDataFromObject(
                  omit(values, [
                    "metInsuredInPerson",
                    "documentIsCopyShownByInsured",
                    "photoIsOfInsured",
                    "insuredHasBeenIdentified",
                    "residenceProofProvidedLater",
                  ]),
                ),
                insuredFiscalCode: lip.insured.fiscalCode,
              });

              closeModal();
            } catch (error) {
              throw {
                root: {
                  type: "server",
                  message: normalizeError(
                    error,
                    "Errore imprevisto nell'aggiornamento dell'identificazione dell'assicurato, riprova più tardi.",
                  ).message,
                },
              };
            }
          }}
          formMethods={formMethods}
          className="vstack gap-3"
        >
          <Row className="row-gap-3">
            <h4>Documento d'identità:</h4>
            <IdentityDocumentForm
              onlyIdentityCard={lip.salesMode === "remote"}
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
                          lip.salesMode === "remote" &&
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
            {lip.salesMode === "remote" && (
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
                        lip.salesMode === "remote" &&
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
                controlId="metInsuredInPerson"
                as={BorderFeedback}
                className="position-relative"
              >
                <FieldError />
                <CheckboxField
                  type="checkbox"
                  label={
                    lip.salesMode === "remote"
                      ? "Di aver identificato il Contraente a distanza"
                      : "Di aver incontrato il Contraente di persona"
                  }
                  validation={{
                    required:
                      lip.salesMode === "remote"
                        ? "Per procedere devi dichiarare di aver identificato il Contraente a distanza"
                        : "Per procedere devi dichiarare di aver incontrato il Contraente di persona",
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
