"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {YesNoAnswer} from "@/helpers/TypesHelper";
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
  FormGroup,
  FormLabel,
  InputGroup,
  ModalBody,
  ModalFooter,
  Row,
} from "react-bootstrap";
import {useForm} from "react-hook-form";

export const educationOptions = [
  {label: "Nessun titolo di studio", value: "no_degree"},
  {
    label: "Licenza scuola primaria/media",
    value: "primary_middle_school_license",
  },
  {
    label: "Diploma di scuola superiore",
    value: "high_school_diploma",
  },
  {label: "Laurea", value: "degree"},
  {
    label:
      "Laurea o specializzazione post-universitaria in campo giuridico, economico o finanziario",
    value: "degree_specialization",
  },
  {label: "Altro (specificare)", value: "other"},
] as const;
export type EducationOptions = (typeof educationOptions)[number]["value"];

export const jobOptions = [
  {
    label: "Lavoratore subordinato a tempo indeterminato",
    value: "permanent_employee",
  },
  {
    label: "Lavoratore subordinato a tempo determinato",
    value: "fixed_term_employee",
  },
  {
    label: "Contratto temporaneo",
    value: "temporary_contract",
  },
  {
    label: "Autonomo o libero professionista",
    value: "self_employed_or_freelancer",
  },
  {label: "Pensionato", value: "retired"},
  {label: "Non occupato", value: "unemployed"},
  {label: "Altro (specificare)", value: "other"},
] as const;
export type JobOptions = (typeof jobOptions)[number]["value"];

export const familyOptions = [
  {label: "Nessuno", value: "0"},
  {label: "1", value: "1"},
  {label: "2", value: "2"},
  {label: "3", value: "3"},
  {label: "4 o più", value: "4+"},
] as const;
export type FamilyOptions = (typeof familyOptions)[number]["value"];

export const dependentFamilyMembersOptions = [
  {label: "Nessuno", value: "0"},
  {label: "1", value: "1"},
  {label: "2", value: "2"},
  {label: "3", value: "3"},
  {label: "4 o più", value: "4+"},
] as const;
export type DependentFamilyMembersOptions =
  (typeof dependentFamilyMembersOptions)[number]["value"];

export const needsToMeetOptions = [
  {
    label: "Risparmio e conservazione del patrimonio",
    value: "savings_and_wealth_preservation",
  },
  {
    label: "Investimento",
    value: "investment",
  },
  {
    label:
      "Protezione assicurativa della persona (morte, invalidità, malattie gravi)",
    value: "personal_insurance_protection",
  },
  {
    label: "Previdenza/pensione complementare",
    value: "supplementary_pension",
  },
  {
    label: "Altro (specificare)",
    value: "other",
  },
] as const;
export type NeedsToMeetOptions = (typeof needsToMeetOptions)[number]["value"];

export const economicConditionOptions = [
  {label: "In crescita", value: "growing"},
  {label: "Stazionaria", value: "stationary"},
  {label: "In diminuzione", value: "decreasing"},
] as const;
export type EconomicConditionOptions =
  (typeof economicConditionOptions)[number]["value"];

export const expectationsOptions = [
  {
    label:
      "Proteggere la mia abitazione e i miei beni personali/familiari di valore",
    value: "home_protection",
  },
  {
    label:
      "Prevedere un capitale assicurato ai miei eredi (o comunque a persone a me care), che intendo proteggere contro il rischio di decesso, e/o proteggermi dal rischio di infortunio e/o malattia",
    value: "capital_and_personal_protection",
  },
  {
    label: "Investimento unitamente a una protezione del capitale",
    value: "investment_with_capital_protection",
  },
  {
    label: "Investimento",
    value: "investment",
  },
] as const;
export type ExpectationsOptions = (typeof expectationsOptions)[number]["value"];

export const durationOptions = [
  {label: "Limitato (un anno)", value: "1_year"},
  {label: "Breve (da uno a cinque anni)", value: "short_term"},
  {label: "Lungo (maggiore di cinque anni)", value: "long_term"},
] as const;
export type DurationOptions = (typeof durationOptions)[number]["value"];

const denDefaultValues = {
  education: "" as EducationOptions,
  job: "" as JobOptions,
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
  const formMethods = useForm({
    mode: "onChange",
    defaultValues: denDefaultValues,
  });

  const dependentFamilyMembersValue = formMethods.watch(
    "dependentFamilyMembers",
  );
  const otherInsuranceProductsValue = formMethods.watch(
    "otherInsuranceProducts",
  );

  const closeModal = useDrawerStore((state) => state.closeModal);
  const updateDenData = useDrawerStore((state) => state.updateDenData);

  return (
    <>
      <ModalBody>
        <Form
          id="den-form"
          onSubmit={(values) => {
            updateDenData(values);
            closeModal();
          }}
          formMethods={formMethods}
          className="vstack gap-3"
        >
          <Row className="row-gap-3">
            <h4>Situazione personale e familiare</h4>
            <Col className="d-flex" xs={12} sm={6}>
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
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="job" as={BorderFeedback}>
                <FormLabel>Attuale occupazione</FormLabel>
                <FieldError />
                <SelectField
                  placeholder="Attuale occupazione del contraente"
                  options={jobOptions}
                  validation={{
                    required: "Seleziona l'attuale occupazione del contraente",
                  }}
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
                        console.log(
                          "vero?",
                          `${parseInt(value, 10)} > ${parseInt(formValues.family, 10)}`,
                        );
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
                    formMethods.trigger("needsIntendToMeet");
                  }}
                  validation={{
                    required: "Seleziona un'opzione",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
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
                  type="checkbox"
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
