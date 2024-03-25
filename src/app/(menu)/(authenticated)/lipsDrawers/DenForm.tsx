"use client";

import {updateDen} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {
  dependentFamilyMembersOptions,
  DependentFamilyMembersOptions,
  durationOptions,
  DurationOptions,
  economicConditionOptions,
  EconomicConditionOptions,
  educationOptions,
  EducationOptions,
  expectationsOptions,
  ExpectationsOptions,
  familyOptions,
  FamilyOptions,
  JobPosition,
  jobPositionOptions,
  needsToMeetOptions,
  NeedsToMeetOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {getOptionsLabel, YesNoAnswer} from "@/helpers/getOptionsLabel";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {HelpText} from "@/ui/form/HelpText";
import {InputField} from "@/ui/form/InputField";
import {SelectField} from "@/ui/form/SelectField";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  Button,
  Col,
  FormControl,
  FormGroup,
  FormLabel,
  InputGroup,
  ModalBody,
  ModalFooter,
  Row,
  Stack,
} from "react-bootstrap";
import {useForm} from "react-hook-form";
import invariant from "tiny-invariant";

const denDefaultValues = {
  education: "" as EducationOptions,
  educationOther: "",
  job: "" as JobPosition,
  family: "" as FamilyOptions,
  dependentFamilyMembers: "" as DependentFamilyMembersOptions,
  otherInsuranceProducts: "" as YesNoAnswer,
  needsIntendToMeet: [] as NeedsToMeetOptions[],
  savings: "",
  income: "",
  economicCondition: "" as EconomicConditionOptions,
  expectations: [] as ExpectationsOptions[],
  duration: "" as DurationOptions,
};

export function DenForm() {
  const job = useDrawerStore(
    (state) => state.lip?.contractor.pep?.job.position.response,
  );
  const jobOther = useDrawerStore(
    (state) => state.lip?.contractor.pep?.job.positionOther,
  );

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: {...denDefaultValues, ...(job && {job})},
  });

  const lipId = useDrawerStore((state) => state.lip?.id);
  const closeModal = useDrawerStore((state) => state.closeModal);

  const dependentFamilyMembersValue = formMethods.watch(
    "dependentFamilyMembers",
  );
  const otherInsuranceProductsValue = formMethods.watch(
    "otherInsuranceProducts",
  );
  const educationValue = formMethods.watch("education");
  const needsIntendToMeetValue = formMethods.watch("needsIntendToMeet");

  return (
    <>
      <ModalBody>
        <Form
          id="den-form"
          onSubmit={async (values) => {
            invariant(lipId, "lipId is required");
            const updateDenResponse = await updateDen(values, lipId);

            if (updateDenResponse.status === "failed") {
              throw {
                root: {
                  type: "server",
                  message: updateDenResponse.message,
                },
              };
            }

            closeModal();
          }}
          formMethods={formMethods}
          className="vstack gap-3"
        >
          <Row className="row-gap-3">
            <h4>Situazione personale e familiare</h4>
            <Col className="d-flex" xs={12} sm={6}>
              <Stack gap={3}>
                <FormGroup controlId="education" as={BorderFeedback}>
                  <FormLabel>Titolo di studio</FormLabel>
                  <FieldError />
                  <SelectField
                    placeholder="Titolo di studio del contraente"
                    options={educationOptions}
                    validation={{
                      required: "Seleziona il titolo di studio del contraente",
                    }}
                  />
                </FormGroup>
                {educationValue === "other" && (
                  <FormGroup controlId="educationOther" as={BorderFeedback}>
                    <FormLabel>Specifica il titolo di studio</FormLabel>
                    <FieldError />
                    <InputField
                      type="text"
                      placeholder="Specifica il titolo di studio"
                      validation={{
                        required: "Inserisci il titolo di studio",
                      }}
                    />
                  </FormGroup>
                )}
              </Stack>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="job" as={BorderFeedback}>
                <FormLabel>Attuale occupazione</FormLabel>
                <FieldError />
                <InputField
                  type="hidden"
                  placeholder="Attuale occupazione del contraente"
                  readOnly
                  plaintext
                />
                <FormControl
                  type="text"
                  placeholder="Attuale occupazione del contraente"
                  readOnly
                  plaintext
                  name="jobValue"
                  value={
                    job && job !== "other"
                      ? getOptionsLabel(jobPositionOptions, job)
                      : jobOther
                  }
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="family" as={BorderFeedback}>
                <FormLabel>
                  Componenti del nucleo famigliare del contraente (oltre al
                  contraente)
                </FormLabel>
                <FieldError />
                <SelectField
                  onChange={() => {
                    if (!!dependentFamilyMembersValue) {
                      void formMethods.trigger("dependentFamilyMembers");
                    }
                  }}
                  placeholder="Componenti del nucleo famigliare del contraente"
                  options={familyOptions}
                  validation={{
                    required:
                      "Seleziona il numero di componenti del nucleo famigliare del contraente",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="dependentFamilyMembers" as={BorderFeedback}>
                <FormLabel>
                  Componenti del nucleo famigliare a carico del contraente
                </FormLabel>
                <HelpText>
                  Indicare tutti i componenti del nucleo famigliare che non
                  hanno reddito
                </HelpText>
                <FieldError />
                <SelectField
                  placeholder="Componenti del nucleo famigliare a carico del contraente"
                  options={dependentFamilyMembersOptions}
                  validation={{
                    validate: {
                      required: (value) => {
                        if (!value) {
                          return "Seleziona il numero di componenti del nucleo famigliare a carico del contraente";
                        }
                      },
                      max: (value, formValues) => {
                        if (formValues.family === "4+") {
                          return;
                        }
                        if (
                          parseInt(value, 10) > parseInt(formValues.family, 10)
                        ) {
                          return `Il numero di componenti del nucleo famigliare a carico del contraente non può essere maggiore del numero di componenti del nucleo famigliare del contraente`;
                        }
                      },
                    },
                  }}
                />
              </FormGroup>
            </Col>
            <h4>Situazione assicurativa attuale</h4>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="otherInsuranceProducts" as={BorderFeedback}>
                <FormLabel>
                  Attualmente detiene altri prodotti assicurativi?
                </FormLabel>
                <FieldError />
                <CheckGroup
                  type="radio"
                  inline
                  options={[
                    {label: "Sì", value: "yes"},
                    {label: "No", value: "no"},
                  ]}
                  onChange={(value) => {
                    if (value === "no") {
                      formMethods.setValue("needsIntendToMeet", []);
                    }
                    void formMethods.trigger("needsIntendToMeet");
                  }}
                  validation={{
                    required: "Seleziona un'opzione",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <Stack gap={3}>
                <FormGroup
                  controlId="needsIntendToMeet"
                  as={BorderFeedback}
                  disabled={otherInsuranceProductsValue !== "yes"}
                >
                  <FormLabel>
                    Se sì, quali esigenze intendono soddisfare?
                  </FormLabel>
                  <FieldError />
                  <CheckGroup
                    disabled={otherInsuranceProductsValue !== "yes"}
                    type="checkbox"
                    onChange={() => {
                      formMethods.clearErrors("needsIntendToMeet");
                    }}
                    options={needsToMeetOptions}
                    validation={{
                      validate: {
                        required: (
                          value,
                          formValues: typeof denDefaultValues,
                        ) => {
                          if (
                            formValues.otherInsuranceProducts === "yes" &&
                            (!value || value.length === 0)
                          ) {
                            return "Seleziona almeno un'opzione";
                          }
                        },
                      },
                    }}
                  />
                </FormGroup>
                {needsIntendToMeetValue.includes("other") && (
                  <FormGroup
                    controlId="needsIntendToMeetOther"
                    as={BorderFeedback}
                  >
                    <FormLabel>
                      Specifica quali esigenze intendono soddisfare?
                    </FormLabel>
                    <FieldError />
                    <InputField
                      type="text"
                      placeholder="Specifica quali esigenze intendono soddisfare"
                      validation={{
                        required:
                          "Inserisci quali esigenze intendono soddisfare",
                      }}
                    />
                  </FormGroup>
                )}
              </Stack>
            </Col>
            <h4>Situazione finanziaria</h4>
            <Col className="d-flex" xs={12} sm={4}>
              <FormGroup controlId="income" as={BorderFeedback}>
                <FormLabel>
                  A quanto ammonta attualmente il suo reddito medio annuo?
                </FormLabel>
                <FieldError />
                <InputGroup>
                  <InputField
                    type="number"
                    placeholder="Reddito medio annuo"
                    validation={{
                      required: "Inserisci il tuo reddito medio annuo attuale",
                    }}
                  />
                  <InputGroup.Text>,00 €</InputGroup.Text>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={4}>
              <FormGroup controlId="savings" as={BorderFeedback}>
                <FormLabel>
                  Qual è attualmente la sua capacità di risparmio media mensile?
                </FormLabel>
                <FieldError />
                <InputGroup>
                  <InputField
                    type="number"
                    placeholder="Capacità di risparmio media mensile"
                    validation={{
                      required:
                        "Inserisci la tua capacità di risparmio media mensile",
                    }}
                  />
                  <InputGroup.Text>,00 €</InputGroup.Text>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={4}>
              <FormGroup controlId="economicCondition" as={BorderFeedback}>
                <FormLabel>
                  Quale potrebbe essere, in prospettiva, l'andamento della sua
                  condizione economica?
                </FormLabel>
                <FieldError />
                <SelectField
                  placeholder="Andamento della condizione economica"
                  options={economicConditionOptions}
                  validation={{
                    required: "Seleziona la tua situazione economica attuale",
                  }}
                />
              </FormGroup>
            </Col>
            <h4>
              Aspettative in relazione alla sottoscrizione di un contratto di
              assicurazione
            </h4>
            <Col xs={12}>
              <FormGroup controlId="expectations" as={BorderFeedback}>
                <FormLabel>
                  Quali sono le sue attuali aspettative e/o obiettivi in
                  relazione alla sottoscrizione di un contratto di
                  assicurazione?
                </FormLabel>
                <CheckGroup
                  type="radio"
                  options={expectationsOptions}
                  validation={{
                    validate: {
                      required: (value) => {
                        if (!value || value.length === 0) {
                          return "Seleziona almeno un'opzione";
                        }
                      },
                    },
                  }}
                />
              </FormGroup>
            </Col>
            <h4>Aspettative in merito alla durata del contratto</h4>
            <Col xs={12}>
              <FormGroup controlId="duration" as={BorderFeedback}>
                <FormLabel>
                  Il cliente ha bisogno di coperture assicurative che coprano
                  rischi per un periodo di tempo
                </FormLabel>
                <FieldError />
                <CheckGroup
                  type="radio"
                  options={durationOptions}
                  validation={{required: "Seleziona un'opzione"}}
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
        <Button type="submit" variant="primary" form="den-form">
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
