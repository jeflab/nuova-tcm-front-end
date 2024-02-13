"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckboxField} from "@/ui/form/CheckboxField";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {ComuneProvAutocompleteField} from "@/ui/form/ComuneProvAutocompleteField";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {
  emailNormalizer,
  onlyNumbersNormalizer,
  upperCaseNormalizer,
} from "@/ui/form/normalizers";
import {email} from "@/ui/form/validators/email";
import {fiscalCodeValidator} from "@/ui/form/validators/fiscalCode";
import autoAnimate from "@formkit/auto-animate";
import {
  faSave,
  faSpinner,
  faUserMinus,
  faUserPlus,
  faXmark,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Fragment, useEffect, useRef} from "react";
import {
  Alert,
  Button,
  Col,
  FormGroup,
  FormLabel,
  InputGroup,
  ModalBody,
  ModalFooter,
  Row,
} from "react-bootstrap";
import {useFieldArray, useForm} from "react-hook-form";

export const nominationOptions = [
  {
    label: "Il contraente designa i seguenti Beneficiari",
    value: "beneficiaries",
  },
  {
    label:
      "Il contraente designa come Beneficiari gli eredi testamentari o, in assenza di testamento, gli eredi legittimi del contraente-assicurato in parti uguali fra loro",
    value: "heirs",
  },
] as const;
export type NominationOption = (typeof nominationOptions)[number]["value"];

const beneficiaryDefaultValues = {
  name: "",
  surname: "",
  birthDate: "",
  birthPlace: {city: "", province: ""},
  fiscalCode: "",
  streetName: "",
  streetNumber: "",
  place: {city: "", province: ""},
  zipCode: "",
  phone: "",
  email: "",
  share: "",
};

const beneficiariesDefaultValues = {
  nomination: "" as NominationOption,
  thirdParty: false,
  beneficiaries: [beneficiaryDefaultValues],
  thirdPartyContactPerson: {
    name: "",
    surname: "",
    birthDate: "",
    birthPlace: {city: "", province: ""},
    fiscalCode: "",
    place: {
      city: "",
      province: "",
    },
    streetName: "",
    streetNumber: "",
    zipCode: "",
    phone: "",
    email: "",
  },
};
export function BeneficiariesForm() {
  const animateContainer = useRef(null);
  const formMethods = useForm({
    mode: "onChange",
    defaultValues: beneficiariesDefaultValues,
  });
  const {fields, append, remove} = useFieldArray({
    control: formMethods.control,
    name: "beneficiaries",
  });

  const nominationValue = formMethods.watch("nomination");
  const thirdPartyValue = formMethods.watch("thirdParty");

  useEffect(() => {
    animateContainer.current && autoAnimate(animateContainer.current);
  }, []);

  const closeModal = useDrawerStore((state) => state.closeModal);
  const updateBeneficiaries = useDrawerStore(
    (state) => state.updateBeneficiariesData,
  );

  return (
    <>
      <ModalBody>
        <Form
          id="healt-questionnaire-form"
          onSubmit={(values) => {
            if (
              values.nomination === "beneficiaries" &&
              values.beneficiaries.reduce(
                (acc, curr) => acc + parseInt(curr.share, 10),
                0,
              ) !== 100
            ) {
              throw {
                root: {
                  type: "shareSum",
                  message:
                    "La somma delle quote dei Beneficiari deve essere uguale a 100",
                },
              };
            }
            updateBeneficiaries(values);
            closeModal();
          }}
          formMethods={formMethods}
        >
          <div ref={animateContainer} className="vstack gap-3">
            <Row>
              <Col>
                <FormGroup controlId="nomination" as={BorderFeedback}>
                  <FieldError />
                  <CheckGroup
                    type="radio"
                    options={nominationOptions}
                    validation={{required: "Scegli i Beneficiari"}}
                  />
                </FormGroup>
              </Col>
            </Row>
            {nominationValue === "beneficiaries" ? (
              <Row className="row-gap-3">
                {fields.map((field, index) => (
                  <Fragment key={field.id}>
                    <div className="d-flex">
                      <h4 className="w-100 me-auto">
                        Beneficiario {index + 1}
                      </h4>
                      {fields.length > 1 && (
                        <Button
                          variant="danger"
                          type="button"
                          onClick={() => remove(index)}
                          className="text-nowrap"
                        >
                          <FontAwesomeIcon
                            icon={faUserMinus}
                            className="me-2"
                          />{" "}
                          Rimuovi Beneficiario {index + 1}
                        </Button>
                      )}
                    </div>
                    <Col className="d-flex" xs={12} sm={6}>
                      <FormGroup
                        controlId={`beneficiaries.${index}.surname`}
                        as={BorderFeedback}
                      >
                        <FormLabel>Cognome</FormLabel>
                        <FieldError />
                        <InputField
                          type="text"
                          placeholder="Cognome"
                          validation={{
                            required: "Inserisci il cognome del Beneficiario",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="d-flex" xs={12} sm={6}>
                      <FormGroup
                        controlId={`beneficiaries.${index}.name`}
                        as={BorderFeedback}
                      >
                        <FormLabel>Nome</FormLabel>
                        <FieldError />
                        <InputField
                          type="text"
                          placeholder="Nome"
                          validation={{
                            required: "Inserisci il nome del Beneficiario",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="d-flex" xs={12} sm={6} md={4} lg={5}>
                      <FormGroup
                        controlId={`beneficiaries.${index}.birthDate`}
                        as={BorderFeedback}
                      >
                        <FormLabel>Data di nascita</FormLabel>
                        <FieldError />
                        <InputField
                          type="date"
                          validation={{
                            required:
                              "Inserisci la data di nascita del Beneficiario",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="d-flex" xs={12} md={5} lg={7}>
                      <FormGroup
                        controlId={`beneficiaries.${index}.birthPlace`}
                        as={BorderFeedback}
                      >
                        <FormLabel>Luogo di nascita</FormLabel>
                        <FieldError
                          name={`beneficiaries.${index}.birthPlace.city`}
                        />
                        <FieldError
                          name={`beneficiaries.${index}.birthPlace.province`}
                          disableIf={[`beneficiaries.${index}.birthPlace.city`]}
                        />
                        <ComuneProvAutocompleteField
                          placeholder="Luogo di nascita"
                          validation={{
                            required:
                              "Inserisci il luogo di nascita del Beneficiario",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col xs={12}>
                      <FormGroup
                        controlId={`beneficiaries.${index}.fiscalCode`}
                        as={BorderFeedback}
                      >
                        <FormLabel>Codice Fiscale</FormLabel>
                        <FieldError />
                        <InputField
                          type="text"
                          placeholder="Codice Fiscale"
                          normalize={upperCaseNormalizer}
                          validation={{
                            validate: {
                              required: (value) => {
                                if (!value) {
                                  return "Inserisci il codice fiscale del Beneficiario";
                                }
                              },
                              custom: (value) => {
                                if (!fiscalCodeValidator(value)) {
                                  return "Il codice fiscale inserito non è valido";
                                }
                              },
                            },
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="d-flex" xs={12} md={9}>
                      <FormGroup
                        controlId={`beneficiaries.${index}.streetName`}
                        as={BorderFeedback}
                      >
                        <FormLabel>Indirizzo</FormLabel>
                        <FieldError />
                        <InputField
                          type="text"
                          placeholder="Indirizzo di residenza"
                          validation={{
                            required: "Inserisci l'indirizzo del contraente",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="d-flex" xs={12} md={3}>
                      <FormGroup
                        controlId={`beneficiaries.${index}.streetNumber`}
                        as={BorderFeedback}
                      >
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
                      <FormGroup
                        controlId={`beneficiaries.${index}.place`}
                        as={BorderFeedback}
                      >
                        <FormLabel>Città</FormLabel>
                        <FieldError
                          name={`beneficiaries.${index}.place.city`}
                        />
                        <FieldError
                          name={`beneficiaries.${index}.place.province`}
                          disableIf={[`beneficiaries.${index}.place.city`]}
                        />
                        <ComuneProvAutocompleteField
                          placeholder="Città di residenza"
                          onlyExisting
                          validation={{
                            required:
                              "Inserisci la città di residenza del Beneficiario",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="d-flex" xs={12} md={3}>
                      <FormGroup
                        controlId={`beneficiaries.${index}.zipCode`}
                        as={BorderFeedback}
                      >
                        <FormLabel>CAP</FormLabel>
                        <FieldError />
                        <InputField
                          type="text"
                          placeholder="CAP"
                          validation={{
                            required: "Inserisci l'indirizzo del Beneficiario",
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
                    <Col className="d-flex" xs={12} md={4}>
                      <FormGroup
                        controlId={`beneficiaries.${index}.phone`}
                        as={BorderFeedback}
                      >
                        <FormLabel>Telefono</FormLabel>
                        <FieldError />
                        <InputField
                          type="tel"
                          placeholder="Telefono"
                          validation={{
                            required: "Inserisci il telefono del Beneficiario",
                          }}
                          normalize={onlyNumbersNormalizer}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="d-flex" xs={12} md={4}>
                      <FormGroup
                        controlId={`beneficiaries.${index}.email`}
                        as={BorderFeedback}
                      >
                        <FormLabel>Email</FormLabel>
                        <FieldError />
                        <InputField
                          type="email"
                          placeholder="Email"
                          validation={{
                            validate: {
                              required: (value) => {
                                if (!value) {
                                  return "Inserisci l'email del Beneficiario";
                                }
                              },
                              pattern: (value) => {
                                if (!email(value)) {
                                  return "L'email inserita non è valida";
                                }
                              },
                            },
                          }}
                          normalize={emailNormalizer}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="d-flex" xs={12} md={4}>
                      <FormGroup
                        controlId={`beneficiaries.${index}.share`}
                        as={BorderFeedback}
                      >
                        <FormLabel>Quota</FormLabel>
                        <FieldError />
                        <InputGroup>
                          <InputField
                            type={"number"}
                            min={0}
                            max={100}
                            step={1}
                            validation={{
                              required: "Inserisci la quota",
                              min: {
                                value: 1,
                                message: "La quota dev'erre maggiore di 0",
                              },
                              max: {
                                value: 100,
                                message: "La quota dev'erre minore di 100",
                              },
                            }}
                          />
                          <InputGroup.Text>%</InputGroup.Text>
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Fragment>
                ))}
                <Col xs={12}>
                  <Button
                    type="button"
                    variant="info"
                    onClick={() => append(beneficiaryDefaultValues)}
                    className="me-auto"
                  >
                    <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                    Aggiungi un Beneficiario
                  </Button>
                </Col>
                <Col xs={12}>
                  <Alert variant="info">
                    In caso di mancata designazione di Beneficiari in forma
                    nominativa la compagnia potrà incontrare maggiori difficoltà
                    nell'identificazione e nella ricerca dei Beneficiari.
                  </Alert>
                  <Alert variant="warning">
                    La modifica o la revoca dei Beneficiari deve essere
                    comunicata alla compagnia.
                  </Alert>
                </Col>
              </Row>
            ) : nominationValue === "heirs" ? (
              <>
                <Alert variant="info" className="mb-0">
                  Ove non sia designato alcun Beneficiario, la prestazione
                  assicurativa sarà corrisposta in favore degli eredi
                  testamentari o, in mancanza di testamento, degli eredi
                  legittimi del contraente-assicurato
                </Alert>
                <Alert variant="warning" className="mb-0">
                  In caso di mancata indicazione nominativa del Beneficiario, la
                  compagnia potrà incontrare, al decesso dell'assicurato,
                  maggiori difficoltà nelle identificazione e nella ricerca del
                  Beneficiario
                </Alert>
              </>
            ) : null}
            <FormGroup controlId="thirdParty" as={BorderFeedback}>
              <CheckboxField
                type="checkbox"
                label="Il Contraente-Assicurato dichiara di voler escludere l’invio di comunicazioni ai Beneficiari, prima dell’evento assicurato."
              />
            </FormGroup>
            {thirdPartyValue && (
              <Row className="row-gap-3">
                <Col xs={12}>
                  <Alert variant="info" className="mb-0">
                    Il Contraente-Assicurato, per specifiche esigenze di
                    riservatezza, indica come referente terzo, diverso dai
                    Beneficiari, il soggetto di seguito indicato, al quale la
                    Compagnia farà riferimento in caso di decesso del
                    Contraente-Assicurato:
                  </Alert>
                </Col>
                <h4 className="w-100 me-auto">Referente terzo</h4>
                <Col className="d-flex" xs={12} sm={6}>
                  <FormGroup
                    controlId={`thirdPartyContactPerson.surname`}
                    as={BorderFeedback}
                  >
                    <FormLabel>Cognome</FormLabel>
                    <FieldError />
                    <InputField
                      type="text"
                      placeholder="Cognome"
                      validation={{
                        required: "Inserisci il cognome del Beneficiario",
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col className="d-flex" xs={12} sm={6}>
                  <FormGroup
                    controlId={`thirdPartyContactPerson.name`}
                    as={BorderFeedback}
                  >
                    <FormLabel>Nome</FormLabel>
                    <FieldError />
                    <InputField
                      type="text"
                      placeholder="Nome"
                      validation={{
                        required: "Inserisci il nome del Beneficiario",
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col className="d-flex" xs={12} sm={6} md={4} lg={5}>
                  <FormGroup
                    controlId={`thirdPartyContactPerson.birthDate`}
                    as={BorderFeedback}
                  >
                    <FormLabel>Data di nascita</FormLabel>
                    <FieldError />
                    <InputField
                      type="date"
                      validation={{
                        required:
                          "Inserisci la data di nascita del Beneficiario",
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col className="d-flex" xs={12} md={5} lg={7}>
                  <FormGroup
                    controlId={`thirdPartyContactPerson.birthPlace`}
                    as={BorderFeedback}
                  >
                    <FormLabel>Luogo di nascita</FormLabel>
                    <FieldError
                      name={`thirdPartyContactPerson.birthPlace.city`}
                    />
                    <FieldError
                      name={`thirdPartyContactPerson.birthPlace.province`}
                      disableIf={[`thirdPartyContactPerson.birthPlace.city`]}
                    />
                    <ComuneProvAutocompleteField
                      placeholder="Luogo di nascita"
                      validation={{
                        required:
                          "Inserisci il luogo di nascita del Beneficiario",
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col xs={12}>
                  <FormGroup
                    controlId={`thirdPartyContactPerson.fiscalCode`}
                    as={BorderFeedback}
                  >
                    <FormLabel>Codice Fiscale</FormLabel>
                    <FieldError />
                    <InputField
                      type="text"
                      placeholder="Codice Fiscale"
                      normalize={upperCaseNormalizer}
                      validation={{
                        validate: {
                          required: (value) => {
                            if (!value) {
                              return "Inserisci il codice fiscale del Beneficiario";
                            }
                          },
                          custom: (value) => {
                            if (!fiscalCodeValidator(value)) {
                              return "Il codice fiscale inserito non è valido";
                            }
                          },
                        },
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col className="d-flex" xs={12} md={9}>
                  <FormGroup
                    controlId={`thirdPartyContactPerson.streetName`}
                    as={BorderFeedback}
                  >
                    <FormLabel>Indirizzo</FormLabel>
                    <FieldError />
                    <InputField
                      type="text"
                      placeholder="Indirizzo di residenza"
                      validation={{
                        required: "Inserisci l'indirizzo del contraente",
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col className="d-flex" xs={12} md={3}>
                  <FormGroup
                    controlId={`thirdPartyContactPerson.streetNumber`}
                    as={BorderFeedback}
                  >
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
                  <FormGroup
                    controlId={`thirdPartyContactPerson.place`}
                    as={BorderFeedback}
                  >
                    <FormLabel>Città</FormLabel>
                    <FieldError name={`thirdPartyContactPerson.place.city`} />
                    <FieldError
                      name={`thirdPartyContactPerson.place.province`}
                      disableIf={[`thirdPartyContactPerson.place.city`]}
                    />
                    <ComuneProvAutocompleteField
                      placeholder="Città di residenza"
                      onlyExisting
                      validation={{
                        required:
                          "Inserisci la città di residenza del Beneficiario",
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col className="d-flex" xs={12} md={3}>
                  <FormGroup
                    controlId={`thirdPartyContactPerson.zipCode`}
                    as={BorderFeedback}
                  >
                    <FormLabel>CAP</FormLabel>
                    <FieldError />
                    <InputField
                      type="text"
                      placeholder="CAP"
                      validation={{
                        required: "Inserisci l'indirizzo del Beneficiario",
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
                <Col className="d-flex" xs={12} md={6}>
                  <FormGroup
                    controlId={`thirdPartyContactPerson.phone`}
                    as={BorderFeedback}
                  >
                    <FormLabel>Telefono</FormLabel>
                    <FieldError />
                    <InputField
                      type="tel"
                      placeholder="Telefono"
                      validation={{
                        required: "Inserisci il telefono del Beneficiario",
                      }}
                      normalize={onlyNumbersNormalizer}
                    />
                  </FormGroup>
                </Col>
                <Col className="d-flex" xs={12} md={6}>
                  <FormGroup
                    controlId={`thirdPartyContactPerson.email`}
                    as={BorderFeedback}
                  >
                    <FormLabel>Email</FormLabel>
                    <FieldError />
                    <InputField
                      type="email"
                      placeholder="Email"
                      validation={{
                        validate: {
                          required: (value) => {
                            if (!value) {
                              return "Inserisci l'email del Beneficiario";
                            }
                          },
                          pattern: (value) => {
                            if (!email(value)) {
                              return "L'email inserita non è valida";
                            }
                          },
                        },
                      }}
                      normalize={emailNormalizer}
                    />
                  </FormGroup>
                </Col>
              </Row>
            )}
            <FieldError
              name="root"
              as={Alert}
              variant="danger"
              className="mb-0 w-100"
            />
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="cancel" onClick={() => closeModal()}>
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          Annulla
        </Button>
        <Button type="submit" variant="primary" form="healt-questionnaire-form">
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
