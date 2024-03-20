"use client";

import {updateContractorData} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {
  FundSource,
  fundSourceOptions,
  Gender,
  gendersOptions,
  JobPosition,
  jobPositionOptions,
  OngoingRelationship,
  ongoingRelationshipOptions,
  PublicOffices,
  publicOfficesOptions,
  TAECode,
  tAECodeOptions,
} from "@/app/(menu)/(authenticated)/lips/[id]/selectsOptions";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {cns} from "@/helpers/cns";
import {dbDateString} from "@/helpers/dates";
import {YesNoAnswer} from "@/helpers/getOptionsLabel";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {ComuneProvAutocompleteField} from "@/ui/form/ComuneProvAutocompleteField";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {HelpText} from "@/ui/form/HelpText";
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
  Stack,
} from "react-bootstrap";
import {useForm} from "react-hook-form";
import invariant from "tiny-invariant";

const contractorDataDefaultValues = {
  contractorPersonalData: {
    birthDate: "",
    birthPlace: {
      city: "",
      province: "",
    },
    fiscalCode: "",
    gender: "" as Gender,
    name: "",
    surname: "",
  },
  contact: {
    phone: "",
    email: "",
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
    publicOffice: "" as PublicOffices,
    otherPep: "" as YesNoAnswer,
  },
  job: {
    position: "" as JobPosition,
    positionOther: "",
    tAECode: "" as TAECode,
    province: "",
    country: "",
  },
  ongoingRelationship: "" as OngoingRelationship,
  fundSource: "" as FundSource,
  fundSourceOther: "",
};

export function ContractorDataForm() {
  const lipId = useDrawerStore((state) => state.lip?.id);
  const contractor = useDrawerStore((state) => state.lip?.contractor);

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: {
      ...contractorDataDefaultValues,
      ...(contractor && {
        contractorPersonalData: {
          birthDate: dbDateString(contractor.birthDate),
          birthPlace: {
            city: contractor.birthPlace,
            province: contractor.birthProvince,
          },
          fiscalCode: contractor.fiscalCode,
          gender: contractor.gender,
          name: contractor.name,
          surname: contractor.surname,
        },
        contact: {
          phone: contractor.phone,
          email: contractor.email,
        },
      }),
    },
  });

  const closeModal = useDrawerStore((state) => state.closeModal);

  const jobPositionValue = formMethods.watch("job.position");
  const fundSourceValue = formMethods.watch("fundSource");

  return (
    <>
      <ModalBody>
        <Form
          onSubmit={async (values) => {
            invariant(contractor, "Contractor must be defined");
            invariant(lipId, "Lip ID must be defined");
            const updatedContractor = await updateContractorData(
              contractor.id,
              lipId,
              values,
            );

            if (updatedContractor.status === "failed") {
              throw {
                root: {
                  type: "server",
                  message: updatedContractor.message,
                },
              };
            }

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
                <InputField type="text" plaintext readOnly />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} lg={5}>
              <FormGroup
                controlId="contractorPersonalData.name"
                as={BorderFeedback}
              >
                <FormLabel>Nome</FormLabel>
                <InputField type="text" plaintext readOnly />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} md={3} lg={2}>
              <FormGroup
                controlId="contractorPersonalData.gender"
                as={BorderFeedback}
              >
                <FormLabel>Genere</FormLabel>
                <CheckGroup type="radio" options={gendersOptions} readOnly />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} md={4} lg={5}>
              <FormGroup
                controlId="contractorPersonalData.birthDate"
                as={BorderFeedback}
              >
                <FormLabel>Data di nascita</FormLabel>
                <InputField type="date" plaintext readOnly />
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
            <h4 className="w-100">Situazione professionale</h4>
            <Col className="d-flex" xs={12} sm={6}>
              <Stack gap={3}>
                <FormGroup controlId="job.position" as={BorderFeedback}>
                  <FormLabel>Attività e professione esercitata</FormLabel>
                  <FieldError />
                  <SelectField
                    placeholder="Seleziona l'attività e professione esercitata"
                    options={jobPositionOptions}
                    validation={{
                      required: "Seleziona l'attività e professione esercitata",
                    }}
                  />
                </FormGroup>
                {jobPositionValue === "other" && (
                  <FormGroup controlId="job.positionOther" as={BorderFeedback}>
                    <FormLabel>
                      Specifica l'attività e professione esercitata
                    </FormLabel>
                    <InputField
                      type="text"
                      placeholder="Specifica l'attività e professione esercitata"
                      validation={{
                        required:
                          "Inserisci l'attività e professione esercitata",
                      }}
                    />
                  </FormGroup>
                )}
              </Stack>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="job.tAECode" as={BorderFeedback}>
                <FormLabel>Codice TAE attività</FormLabel>
                <HelpText>
                  obbligatorio per dipendente, dirigente, imprenditore, libero
                  professionista, lavoratore autonomo
                </HelpText>
                <FieldError />
                <SelectField
                  placeholder="Seleziona codice TAE attività..."
                  options={tAECodeOptions}
                  validation={{
                    required: "Seleziona codice TAE attività",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="job.provice" as={BorderFeedback}>
                <FormLabel>Provincia di attività prevalente</FormLabel>
                <HelpText>(se diversa da residenza)</HelpText>
                <InputField
                  type="text"
                  placeholder="Provincia di attività prevalente"
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="job.country" as={BorderFeedback}>
                <FormLabel>Paese di attività prevalente</FormLabel>
                <HelpText>(se diversa da Italia)</HelpText>
                <InputField
                  type="text"
                  placeholder="Paese di attività prevalente"
                />
              </FormGroup>
            </Col>
            <h4 className="w-100">Persona esposta politicamente</h4>
            <Col className="d-flex" xs={12}>
              <FormGroup controlId="pep.isPep" as={BorderFeedback}>
                <FormLabel>
                  Il contraente è una persona esposta politicamente?
                </FormLabel>
                <HelpText>
                  Si considerano Persone Politicamente Esposte le persone
                  fisiche residenti in Italia o in altri Stati esteri, che
                  occupano o hanno occupato importanti cariche pubbliche nonché
                  i loro familiari diretti o coloro con i quali tali persone
                  intrattengono notoriamente stretti legami, individuate sulla
                  base dei criteri di cui all’art. 1 del D.Lgs. 231/2007.
                </HelpText>
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
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="pep.publicOffice" as={BorderFeedback}>
                <FormLabel>
                  Ricopre cariche pubbliche diverse da P.E.P.
                </FormLabel>
                <HelpText>
                  Es. amministratori locali, ruoli apicali in pubbliche
                  amministrazioni, consorzi o associazioni di natura
                  pubblicistica
                </HelpText>
                <FieldError />
                <SelectField
                  placeholder="Seleziona una risposta..."
                  options={publicOfficesOptions}
                  validation={{
                    required: "Seleziona una risposta",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="pep.otherPep" as={BorderFeedback}>
                <FormLabel>
                  È stato qualificato come P.E.P. nell’ambito di altri rapporti
                  contrattuali stipulati con altri soggetti destinatari del
                  Decreto 231/2007 negli ultimi 2 anni?
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
            <h4 className="w-100">Informazioni sul rapporto continuativo</h4>
            <Col className="d-flex" xs={12}>
              <FormGroup controlId="ongoingRelationship" as={BorderFeedback}>
                <FormLabel>Natura / scopo del rapporto continuativo</FormLabel>
                <FieldError />
                <SelectField
                  placeholder="Seleziona natura / scopo del rapporto continuativo..."
                  options={ongoingRelationshipOptions}
                  validation={{
                    required:
                      "Specificare natura / scopo del rapporto continuativo",
                  }}
                />
              </FormGroup>
            </Col>
            <h4 className="w-100">Origine prevalente dei fondi</h4>
            <Col className="d-flex" xs={12}>
              <Stack gap={3}>
                <FormGroup controlId="fundSource" as={BorderFeedback}>
                  <FormLabel>
                    Specificare l'origine prevalente dei fondi
                  </FormLabel>
                  <HelpText>
                    Il Contraente dichiara che:
                    <ul>
                      <li>
                        i fondi impiegati per il pagamento del premio
                        assicurativo non provengono da una attività criminosa o
                        dalla partecipazione a tale attività;
                      </li>
                      <li>
                        i fondi impiegati per il pagamento del premio
                        assicurativo sono stati oggetto delle comunicazioni e
                        dichiarazioni richieste a fini fiscali dalle Autorità
                        competenti in base alla normativa applicabile.
                      </li>
                    </ul>
                  </HelpText>
                  <FieldError />
                  <SelectField
                    placeholder="Seleziona origine prevalente dei fondi..."
                    options={fundSourceOptions}
                    validation={{
                      required: "Specificare l'origine prevalente dei fondi",
                    }}
                  />
                </FormGroup>
                {fundSourceValue === "other" && (
                  <FormGroup controlId="fundSourceOther" as={BorderFeedback}>
                    <FormLabel></FormLabel>
                    <InputField
                      type="text"
                      placeholder="Specificare l'origine prevalente dei fondi"
                      validation={{
                        required: "Inserisci l'origine prevalente dei fondi",
                      }}
                    />
                  </FormGroup>
                )}
              </Stack>
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
