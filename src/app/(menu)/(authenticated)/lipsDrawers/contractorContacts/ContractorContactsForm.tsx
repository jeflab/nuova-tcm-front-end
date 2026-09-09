"use client";

import {
  useActivateContractorMutation,
  useUpdateContractorContactsMutation,
} from "@/app/(menu)/(authenticated)/lips/[id]/mutations";
import {fatcaQuestions} from "@/app/(menu)/(authenticated)/lipsDrawers/fatca/FatcaForm";
import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {getAccountQuery} from "@/app/(menu)/(authenticated)/queries";
import {cns} from "@/helpers/cns";
import {dbDateString} from "@/helpers/dates";
import {normalizeError} from "@/helpers/errors";
import {isLip} from "@/models/entities/lip";
import {Contractor} from "@/models/entities/personalData";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckboxField} from "@/ui/form/CheckboxField";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {emailNormalizer, onlyNumbersNormalizer} from "@/ui/form/normalizers";
import {emailValidator} from "@/ui/form/validators/email";
import {useDrawerModal} from "@/ui/ModalContext";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSuspenseQuery} from "@tanstack/react-query";
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
  contractorData?: Contractor,
) => ({
  phone: contractorData?.phone ?? "",
  email: contractorData?.email ?? "",
  repeatEmail: contractorData?.email ?? "",
  repeatPhone: contractorData?.phone ?? "",
});

export function ContractorContactsForm() {
  const router = useRouter();
  const {
    data: {lip},
  } = useSuspenseLip();
  const {
    data: {user: loggedUser, roles: loggedUserRoles},
  } = useSuspenseQuery(getAccountQuery());

  const {mutateAsync: activateContractor} = useActivateContractorMutation();
  const {mutateAsync: updateContractorContacts} =
    useUpdateContractorContactsMutation();

  const {closeModal} = useDrawerModal();

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: contractorPersonalAreaActivationDefaultValues(
      isLip(lip) ? lip.contractor : undefined,
    ),
  });

  return (
    <>
      <ModalBody>
        <Form
          onSubmit={async (values) => {
            if (!isLip(lip)) {
              let activateContractorResponse: Awaited<
                ReturnType<typeof activateContractor>
              >;
              try {
                invariant(lip.type, "Tipo di polizza mancante");
                invariant(lip.salesMode, "Modalità di vendita mancante");
                invariant(
                  lip.contractor?.birthDate,
                  "Data di nascita mancante",
                );
                invariant(
                  lip.contractor?.fatca.fatcaCheck.response,
                  "Dati FATCA mancanti",
                );
                invariant(
                  lip.contractor?.fatca.residencyCheck.response,
                  "Dati residenza mancanti",
                );

                activateContractorResponse = await activateContractor({
                  ...values,
                  type: lip.type,
                  salesMode: lip.salesMode,
                  ...(lip.contractor as Contractor),
                  birthDate: dbDateString(lip.contractor.birthDate),
                  fatca: {
                    ...fatcaQuestions.fatcaCheck,
                    response: lip.contractor.fatca.fatcaCheck.response,
                  },
                  italianResidency: {
                    ...fatcaQuestions.residencyCheck,
                    response: lip.contractor.fatca.residencyCheck.response,
                  },
                });

                router.push(`/lips/${activateContractorResponse.lip.id}`, {
                  scroll: false,
                });
                closeModal();
              } catch {
                throw {
                  root: {
                    type: "server",
                    message:
                      "Errore imprevisto nell'attivazione del contraente, riprova più tardi.",
                  },
                };
              }
            } else {
              try {
                await updateContractorContacts({
                  lipId: lip.id,
                  contractorId: lip.contractor.id,
                  formData: values,
                });

                closeModal();
              } catch (error) {
                throw {
                  root: {
                    type: "server",
                    message: normalizeError(
                      error,
                      "Errore imprevisto nell'aggiornamento dei dati del contraente, riprova più tardi.",
                    ).message,
                  },
                };
              }
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
                  onChange={() => {
                    if (!!formMethods.getValues("repeatPhone")) {
                      formMethods.trigger("repeatPhone");
                    }
                  }}
                  validation={{
                    required: "Inserisci il Cellulare del Contraente",
                    validate: {
                      notAgent: (value) => {
                        if (
                          !loggedUserRoles?.some(
                            (role) => role.name === "SuperAdmin",
                          ) &&
                          value === loggedUser?.phone
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
                <FormLabel>E-Mail del Contraente</FormLabel>
                <FieldError />
                <InputField
                  type="email"
                  placeholder="Email del Contraente"
                  onChange={() => {
                    if (!!formMethods.getValues("repeatEmail")) {
                      formMethods.trigger("repeatEmail");
                    }
                  }}
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
                          !loggedUserRoles?.some(
                            (role) => role.name === "SuperAdmin",
                          ) &&
                          value === loggedUser?.email
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
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="repeatPhone" as={BorderFeedback}>
                <FormLabel>Conferma il cellulare</FormLabel>
                <FieldError />
                <InputField
                  type="tel"
                  placeholder="Cellulare del Contraente"
                  validation={{
                    required: "Conferma il Cellulare del Contraente",
                    validate: (value: string, values) => {
                      if (!!value && value !== values.phone) {
                        return "Il cellulare non corrisponde";
                      }
                    },
                  }}
                  normalize={onlyNumbersNormalizer}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="repeatEmail" as={BorderFeedback}>
                <FormLabel>Conferma l'e-mail</FormLabel>
                <FieldError />
                <InputField
                  type="email"
                  placeholder="Email del Contraente"
                  validation={{
                    validate: {
                      required: (value) => {
                        if (!value) {
                          return "Conferma l'e-mail del Contraente";
                        }
                      },
                      validate: (value: string, values) => {
                        if (!!value && value !== values.email) {
                          return "L'e-mail non corrisponde";
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
