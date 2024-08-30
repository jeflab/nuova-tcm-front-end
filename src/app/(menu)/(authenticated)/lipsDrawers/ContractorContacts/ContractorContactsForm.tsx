"use client";

import {
  activateContractor,
  updateContractorContacts,
} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {fatcaQuestions} from "@/app/(menu)/(authenticated)/lipsDrawers/FatcaForm";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {cns} from "@/helpers/cns";
import {Role} from "@/models/account";
import {PersonalData} from "@/models/entities/personalData";
import {User} from "@/models/entities/user";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckboxField} from "@/ui/form/CheckboxField";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {emailNormalizer, onlyNumbersNormalizer} from "@/ui/form/normalizers";
import {emailValidator} from "@/ui/form/validators/email";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/navigation";
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

const contractorPersonalAreaActivationDefaultValues = (
  contractorData?: PersonalData,
) => ({
  phone: contractorData?.phone ?? "",
  email: contractorData?.email ?? "",
});

interface ContractorContactsFormProps {
  loggedUser: User;
  loggedUserRoles: Role[];
}

export function ContractorContactsForm({
  loggedUser,
  loggedUserRoles,
}: ContractorContactsFormProps) {
  const router = useRouter();

  const contractor = useDrawerStore((state) => state.lip?.contractor);
  const lipId = useDrawerStore((state) => state.lip?.id);
  const closeModal = useDrawerStore((state) => state.closeModal);
  const preliminaryData = useDrawerStore((state) => state.preliminaryData);

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: contractorPersonalAreaActivationDefaultValues(contractor),
  });

  return (
    <>
      <ModalBody>
        <Form
          onSubmit={async (values) => {
            if (!contractor) {
              let activateContractorResponse: Awaited<
                ReturnType<typeof activateContractor>
              >;
              try {
                invariant(
                  preliminaryData.contractorPersonalData,
                  "Dati del Contraente mancanti",
                );
                invariant(preliminaryData.fatca, "Dati FATCA mancanti");
                invariant(
                  preliminaryData.italianResidency,
                  "Dati residenza mancanti",
                );

                activateContractorResponse = await activateContractor({
                  ...values,
                  ...preliminaryData.contractorPersonalData,
                  fatca: {
                    ...fatcaQuestions.fatcaCheck,
                    response: preliminaryData.fatca,
                  },
                  italianResidency: {
                    ...fatcaQuestions.residencyCheck,
                    response: preliminaryData.italianResidency,
                  },
                });
              } catch (e) {
                throw {
                  root: {
                    type: "server",
                    message: "Errore imprevisto, riprova più tardi.",
                  },
                };
              }

              if (activateContractorResponse.status !== "success") {
                throw {
                  root: {
                    type: "server",
                    message: activateContractorResponse.message,
                  },
                };
              }

              router.push(`/lips/${activateContractorResponse.lip?.id}`, {
                scroll: false,
              });
              closeModal();
            } else {
              invariant(lipId, "Id analisi mancante");
              const updatedContractor = await updateContractorContacts(
                contractor.id,
                lipId,
                values,
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
            }
          }}
          id="activate-contractor-form"
          formMethods={formMethods}
          className="vstack gap-3"
        >
          <Row className="row-gap-3">
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="phone" as={BorderFeedback}>
                <FormLabel>Cellulare del Contraente</FormLabel>
                <FieldError />
                <InputField
                  type="tel"
                  placeholder="Cellulare del Contraente"
                  validation={{
                    required: "Inserisci il Cellulare del Contraente",
                    validate: {
                      notAgent: (value) => {
                        if (
                          !loggedUserRoles.some(
                            (role) => role.name === "SuperAdmin",
                          ) &&
                          value === loggedUser.phone
                        ) {
                          return "Il numero di telefono inserito non può essere uguale a quello dell'Advisor";
                        }
                      },
                    },
                  }}
                  normalize={onlyNumbersNormalizer}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="email" as={BorderFeedback}>
                <FormLabel>Email del Contraente</FormLabel>
                <FieldError />
                <InputField
                  type="email"
                  placeholder="Email del Contraente"
                  validation={{
                    required: "Inserisci l'email del Contraente",
                    validate: {
                      pattern: (value) => {
                        if (!emailValidator(value)) {
                          return "L'email inserita non è valida";
                        }
                      },
                      notAgent: (value) => {
                        if (
                          !loggedUserRoles.some(
                            (role) => role.name === "SuperAdmin",
                          ) &&
                          value === loggedUser.email
                        ) {
                          return "L'email inserita non può essere uguale a quella dell'Advisor";
                        }
                      },
                    },
                  }}
                  normalize={emailNormalizer}
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
                  label="l'advisor dichiara di aver verificato che il numero di telefono del contraente è di proprietà e uso esclusivo dello stesso"
                  validation={{
                    required:
                      "Per procedere devi confermare di aver verificato il numero di telefono del contraente",
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
            className="mb-0 w-100"
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          type="button"
          variant="cancel"
          onClick={() => closeModal()}
          disabled={formMethods.formState.isSubmitting}
        >
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          Annulla
        </Button>
        <Button
          type="submit"
          variant="primary"
          form="activate-contractor-form"
          disabled={formMethods.formState.isSubmitting}
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
