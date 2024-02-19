"use client";

import {
  ContractorGender,
  contractorGenders,
} from "@/app/(menu)/(authenticated)/lips/[id]/ContractorFiscalCodeForm";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Pep} from "@/app/(menu)/(authenticated)/lips/model";
import {cns} from "@/helpers/cns";
import {YesNoAnswer} from "@/helpers/TypesHelper";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {ComuneProvAutocompleteField} from "@/ui/form/ComuneProvAutocompleteField";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {SelectField} from "@/ui/form/SelectField";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
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

export const pepObject = [
  {label: "Presidente della Repubblica", value: "PRESIDENT_OF_THE_REPUBLIC"},
  {label: "Presidente del Consiglio", value: "PRIME_MINISTER"},
  {label: "Ministro", value: "MINISTER"},
  {
    label: "Vice-Ministro o Sottosegretario",
    value: "VICE_MINISTER_UNDERSECRETARY",
  },
  {label: "Presidente di Regione", value: "REGIONAL_PRESIDENT"},
  {label: "Assessore regionale", value: "REGIONAL_COUNCILLOR"},
  {
    label: "Sindaco di capoluogo di provincia o città metropolitana",
    value: "MAYOR_CAPITAL_PROVINCE",
  },
  {
    label: "Sindaco di comune con popolazione non inferiore a 15.000 abitanti",
    value: "MAYOR_POPULATION_OVER_15000",
  },
  {label: "Deputato", value: "DEPUTY"},
  {label: "Senatore", value: "SENATOR"},
  {label: "Parlamentare europeo", value: "EUROPEAN_PARLIAMENT_MEMBER"},
  {label: "Consigliere regionale", value: "REGIONAL_COUNCIL_MEMBER"},
  {
    label: "Membro degli organi direttivi centrali di partiti politici",
    value: "CENTRAL_DIRECTOR_OF_POLITICAL_PARTIES",
  },
  {
    label: "Giudice della Corte Costituzionale",
    value: "JUDGE_OF_THE_CONSTITUTIONAL_COURT",
  },
  {
    label: "Magistrato della Corte di Cassazione o della Corte dei conti",
    value: "JUDGE_OF_THE_CASSATION_COURT_OR_COURT_OF_AUDITORS",
  },
  {
    label:
      "Consigliere di Stato o altri componenti del Consiglio di Giustizia Amministrativa per la Regione siciliana",
    value:
      "COUNCILOR_OF_STATE_AND_OTHER_MEMBERS_OF_THE_ADMINISTRATIVE_JUSTICE_COUNCIL_FOR_THE_SICILIAN_REGION",
  },
  {
    label:
      "Membro degli organi direttivi delle banche centrali o delle autorità indipendenti",
    value:
      "MEMBER_OF_THE_DIRECTIVE_BODIES_OF_CENTRAL_BANKS_AND_INDEPENDENT_AUTHORITIES",
  },
  {
    label:
      "Ambasciatore, incaricato d’affari ovvero cariche equivalenti in Stati esteri",
    value:
      "AMBASSADOR_CHARGÉ_D'AFFAIRES_OR_EQUIVALENT_POSITIONS_IN_FOREIGN_STATES",
  },
  {
    label:
      "Ufficiale di grado apicale delle forze armate ovvero cariche analoghe in Stati esteri",
    value:
      "HIGH_RANKING_OFFICER_OF_THE_ARMED_FORCES_OR_SIMILAR_POSITIONS_IN_FOREIGN_STATES",
  },
  {
    label:
      "Componente degli organi di amministrazione, direzione o controllo delle imprese controllate",
    value:
      "MEMBER_OF_THE_ADMINISTRATIVE_DIRECTIVE_OR_CONTROL_BODIES_OF_CONTROLLED_COMPANIES",
  },
  {
    label: "Direttore generale di ASL o di azienda ospedaliera",
    value: "GENERAL_DIRECTOR_OF_LOCAL_HEALTH_AGENCY_AND_HOSPITAL_COMPANY",
  },
  {
    label:
      "Direttore, Vicedirettore o Membro dell’organo di gestione o soggetto svolgenti funzioni equivalenti in organizzazioni internazionali",
    value:
      "DIRECTOR_DEPUTY_DIRECTOR_AND_MEMBER_OF_THE_MANAGEMENT_BODY_OR_EQUIVALENT_FUNCTION_PERFORMERS_IN_INTERNATIONAL_ORGANIZATIONS",
  },
] as const;
export type PepPerson = (typeof pepObject)[number]["value"];

export const pepRelations = [
  {label: "Genitori", value: "PARENTS"},
  {
    label: "Coniuge o persona legata in unione civile",
    value: "SPOUSE",
  },
  {
    label: "Convivente di fatto o istituti assimilabili",
    value: "COMMON_LAW_PARTNER",
  },
  {label: "Figli", value: "CHILDREN"},
  {label: "Coniugi dei figli", value: "CHILDREN_SPOUSES"},
  {
    label: "Persone legate ai figli in unione civile",
    value: "PERSONS_LINKED_TO_CHILDREN_CIVIL_UNION",
  },
  {
    label: "Persone legate ai figli in convivenza di fatto",
    value: "PERSONS_LINKED_TO_CHILDREN_COMMON_LAW",
  },
  {
    label: "Persone legate ai figli in istituti assimilabili",
    value: "PERSONS_LINKED_TO_CHILDREN_SIMILAR_INSTITUTES",
  },
] as const;
export type PepRelation = (typeof pepRelations)[number]["value"];

const contractorDataDefaultValues = {
  contractorPersonalData: {
    birthDate: "",
    birthPlace: {
      city: "",
      province: "",
    },
    fiscalCode: "",
    gender: "" as ContractorGender,
    name: "",
    surname: "",
  },
  contact: {
    phone: "0123456789",
    email: "mail@example.com",
  },
  residence: {
    place: {
      city: "",
      province: "",
    },
    streetName: "",
    streetNumber: "",
    zipCode: "",
  },
  pep: {
    isPep: "" as YesNoAnswer,
    person: "",
    relation: "",
  } as Pep,
  aml: {
    job: "",
    sector: "",
    netIncome: "",
    fundSource: "",
  },
};

export function ContractorDataForm() {
  const contractorFiscalCodeData = useDrawerStore(
    (state) => state.lipData.contractorFiscalCode,
  );

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: {
      ...contractorDataDefaultValues,
      ...(contractorFiscalCodeData && {
        contractorPersonalData: contractorFiscalCodeData,
      }),
    },
  });

  const closeModal = useDrawerStore((state) => state.closeModal);
  const updateContractorData = useDrawerStore(
    (state) => state.updateContractorData,
  );

  const showPepFields = formMethods.watch("pep.isPep");

  return (
    <>
      <ModalBody>
        <Form
          onSubmit={(values) => {
            updateContractorData(values);
            closeModal();
          }}
          id="contractor-fiscal-code-form"
          formMethods={formMethods}
        >
          <Row className="row-gap-3">
            <h4 className="w-100">Anagrafica</h4>
            <Col xs={12}>
              <FormGroup
                controlId="contractorPersonalData.fiscalCode"
                as={BorderFeedback}
              >
                <FormLabel>Codice Fiscale</FormLabel>
                <InputField type="text" plaintext readOnly />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} lg={5}>
              <FormGroup
                controlId="contractorPersonalData.surname"
                as={BorderFeedback}
              >
                <FormLabel>Cognome</FormLabel>
                <InputField
                  type="text"
                  plaintext
                  readOnly
                  defaultValue={contractorFiscalCodeData?.surname}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} lg={5}>
              <FormGroup
                controlId="contractorPersonalData.name"
                as={BorderFeedback}
              >
                <FormLabel>Nome</FormLabel>
                <InputField
                  type="text"
                  plaintext
                  readOnly
                  defaultValue={contractorFiscalCodeData?.name}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} md={3} lg={2}>
              <FormGroup
                controlId="contractorPersonalData.gender"
                as={BorderFeedback}
              >
                <FormLabel>Genere</FormLabel>
                <CheckGroup
                  type="radio"
                  options={contractorGenders}
                  readOnly
                  defaultValue={contractorFiscalCodeData?.gender}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} md={4} lg={5}>
              <FormGroup
                controlId="contractorPersonalData.birthDate"
                as={BorderFeedback}
              >
                <FormLabel>Data di nascita</FormLabel>
                <InputField
                  type="date"
                  plaintext
                  readOnly
                  defaultValue={contractorFiscalCodeData?.birthDate}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} md={5} lg={7}>
              <FormGroup
                controlId="contractorPersonalData.birthPlace"
                as={BorderFeedback}
              >
                <FormLabel>Luogo di nascita</FormLabel>
                <ComuneProvAutocompleteField
                  placeholder="Luogo di nascita"
                  plaintext
                  readOnly
                  defaultValue={contractorFiscalCodeData?.birthPlace}
                />
              </FormGroup>
            </Col>
            <h4 className="w-100">Contatti</h4>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="contact.phone" as={BorderFeedback}>
                <FormLabel>Cellulare</FormLabel>
                <InputField type="text" plaintext readOnly />
              </FormGroup>
            </Col>{" "}
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="contact.email" as={BorderFeedback}>
                <FormLabel>E-mail</FormLabel>
                <InputField type="text" plaintext readOnly />
              </FormGroup>
            </Col>
            <h4 className="w-100">Residenza</h4>
            <Col className="d-flex" xs={12} md={9}>
              <FormGroup controlId="residence.streetName" as={BorderFeedback}>
                <FormLabel>Indirizzo</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Indirizzo"
                  validation={{
                    required: "Inserisci l'indirizzo del contraente",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} md={3}>
              <FormGroup controlId="residence.streetNumber" as={BorderFeedback}>
                <FormLabel>N° civico</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="N° civico"
                  validation={{
                    required: "Inserisci il n° civico del contraente",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} md={9}>
              <FormGroup controlId="residence.place" as={BorderFeedback}>
                <FormLabel>Città</FormLabel>
                <FieldError name="residence.place.city" />
                <FieldError
                  name="residence.place.province"
                  disableIf={["residence.place.city"]}
                />
                <ComuneProvAutocompleteField
                  placeholder="Città di residenza"
                  onlyExisting
                  validation={{
                    required: "Inserisci la città di residenza del contraente",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} md={3}>
              <FormGroup controlId="residence.zipCode" as={BorderFeedback}>
                <FormLabel>CAP</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="CAP"
                  validation={{
                    required: "Inserisci l'indirizzo del contraente",
                    minLength: {
                      value: 5,
                      message: "Il CAP deve essere di 5 caratteri",
                    },
                    maxLength: {
                      value: 5,
                      message: "Il CAP deve essere di 5 caratteri",
                    },
                  }}
                  normalize={(value) => value.replace(/\D/g, "")}
                />
              </FormGroup>
            </Col>
            <h4 className="w-100">Persona esposta politicamente</h4>
            <Col className="d-flex" xs={12}>
              <FormGroup controlId="pep.isPep" as={BorderFeedback}>
                <FormLabel>
                  Il contraente è una persona esposta politicamente?
                </FormLabel>
                <FieldError />
                <CheckGroup
                  inline
                  type="radio"
                  options={[
                    {
                      label: "Sì",
                      value: "yes",
                    },
                    {
                      label: "No",
                      value: "no",
                    },
                  ]}
                  validation={{required: "Seleziona una risposta"}}
                />
              </FormGroup>
            </Col>
            {showPepFields === "yes" && (
              <>
                <Col className="d-flex" xs={12} sm={6}>
                  <FormGroup controlId="pep.person" as={BorderFeedback}>
                    <FormLabel>Persona</FormLabel>
                    <FieldError />
                    <SelectField
                      placeholder="Seleziona la tipologia di persona..."
                      options={pepObject}
                      validation={{
                        required: "Seleziona la tipologia di persona",
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col className="d-flex" xs={12} sm={6}>
                  <FormGroup controlId="pep.relation" as={BorderFeedback}>
                    <FormLabel>Tipo di rapporto</FormLabel>
                    <FieldError />
                    <SelectField
                      placeholder="Seleziona il tipo di rapporto..."
                      options={pepRelations}
                      validation={{
                        required: "Seleziona il tipo di rapporto",
                      }}
                    />
                  </FormGroup>
                </Col>
              </>
            )}
            <h4 className="w-100">Antiriciclaggio</h4>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="aml.job" as={BorderFeedback}>
                <FormLabel>Attività o professione esercitata</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Attività o professione esercitata"
                  validation={{
                    required: "Inserisci l'attività o professione esercitata",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="aml.sector" as={BorderFeedback}>
                <FormLabel>Settore di attività prevalente</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Settore di attività prevalente"
                  validation={{
                    required: "Inserisci il settore di attività prevalente",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="aml.netIncome" as={BorderFeedback}>
                <FormLabel>Reddito netto annuo netto</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Reddito netto annuo netto"
                  validation={{
                    required: "Inserisci il reddito netto annuo netto",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="aml.fundSource" as={BorderFeedback}>
                <FormLabel>Origine prevalente dei fondi</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Origine prevalente dei fondi"
                  validation={{
                    required: "Inserisci l'origine prevalente dei fondi",
                  }}
                />
              </FormGroup>
            </Col>
            <Col>
              <FieldError
                name="root"
                as={Alert}
                variant="danger"
                className="mb-0 w-100 px-3"
              />
            </Col>
          </Row>
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
          form="contractor-fiscal-code-form"
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
