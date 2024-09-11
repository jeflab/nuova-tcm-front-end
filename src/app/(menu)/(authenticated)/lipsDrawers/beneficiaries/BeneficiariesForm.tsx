"use client";

import {updateBeneficiaries} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {
  getIdentityDocumentDefaultValues,
  IdentityDocumentForm,
} from "@/app/(menu)/(authenticated)/lipsDrawers/IdentityDocumentForm";
import {
  Gender,
  genderOptions,
  Nomination,
  nominationOptions,
  Relationship,
  relationshipOptions,
  YesNoAnswer,
  yesNoOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {dbDateString} from "@/helpers/dates";
import {Beneficiary, Lip, ThirdParty} from "@/models/entities/lip";
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
import {SelectField} from "@/ui/form/SelectField";
import {emailValidator} from "@/ui/form/validators/email";
import {
  fiscalCodeMatchDataValidator,
  fiscalCodeValidator,
} from "@/ui/form/validators/fiscalCode";
import autoAnimate from "@formkit/auto-animate";
import {
  faSave,
  faSpinner,
  faUserMinus,
  faUserPlus,
  faXmark,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {getDate} from "date-fns/getDate";
import {getMonth} from "date-fns/getMonth";
import {getYear} from "date-fns/getYear";
import {Fragment, useEffect, useRef} from "react";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  FormGroup,
  FormLabel,
  InputGroup,
  ModalBody,
  ModalFooter,
  Row,
  Stack,
} from "react-bootstrap";
import {useFieldArray, useForm} from "react-hook-form";
import invariant from "tiny-invariant";

const beneficiaryDefaultValues = (beneficiaryData?: Beneficiary) => ({
  name: beneficiaryData?.name ?? "",
  surname: beneficiaryData?.surname ?? "",
  birthDate: beneficiaryData?.birthDate
    ? dbDateString(beneficiaryData.birthDate)
    : "",
  birthPlace: {
    city: beneficiaryData?.birthPlace.city ?? "",
    province: beneficiaryData?.birthPlace.province ?? "",
  },
  fiscalCode: beneficiaryData?.fiscalCode ?? "",
  gender: beneficiaryData?.gender ?? ("" as Gender),
  identityDocument: getIdentityDocumentDefaultValues(
    beneficiaryData?.identityDocument,
  ),
  streetName: beneficiaryData?.streetName ?? "",
  streetNumber: beneficiaryData?.streetNumber ?? "",
  place: {
    city: beneficiaryData?.place.city ?? "",
    province: beneficiaryData?.place.province ?? "",
  },
  zipCode: beneficiaryData?.zipCode ?? "",
  phone: beneficiaryData?.phone ?? "",
  email: beneficiaryData?.email ?? "",
  share: beneficiaryData?.share ?? "",
  pep: {
    check: beneficiaryData?.pep.check ?? ("" as YesNoAnswer),
    response: beneficiaryData?.pep.response ?? ("" as Relationship),
    otherValue: beneficiaryData?.pep.otherValue ?? "",
  },
  relationship: {
    check: beneficiaryData?.relationship.check ?? ("" as YesNoAnswer),
    response: beneficiaryData?.relationship.response ?? "",
  },
});

const thirdPartDefaultValues = (thirdParty?: ThirdParty) => ({
  name: thirdParty?.name ?? "",
  surname: thirdParty?.surname ?? "",
  birthDate: thirdParty?.birthDate ? dbDateString(thirdParty.birthDate) : "",
  birthPlace: {
    city: thirdParty?.birthPlace.city ?? "",
    province: thirdParty?.birthPlace.province ?? "",
  },
  fiscalCode: thirdParty?.fiscalCode ?? "",
  gender: thirdParty?.gender ?? ("" as Gender),
  identityDocument: getIdentityDocumentDefaultValues(
    thirdParty?.identityDocument,
  ),
  place: {
    city: thirdParty?.place.city ?? "",
    province: thirdParty?.place.province ?? "",
  },
  streetName: thirdParty?.streetName ?? "",
  streetNumber: thirdParty?.streetNumber ?? "",
  zipCode: thirdParty?.zipCode ?? "",
  phone: thirdParty?.phone ?? "",
  email: thirdParty?.email ?? "",
});

const beneficiariesDefaultValues = (
  beneficiariesData: Lip["beneficiaries"],
) => ({
  nomination: beneficiariesData?.nomination ?? ("" as Nomination),
  thirdParty: beneficiariesData?.thirdParty ?? false,
  beneficiaries: beneficiariesData?.beneficiaries
    ? beneficiariesData?.beneficiaries.map(beneficiaryDefaultValues)
    : beneficiariesData?.nomination === "heirs"
      ? undefined
      : ([beneficiaryDefaultValues()] as
          | undefined
          | ReturnType<typeof beneficiaryDefaultValues>[]),
  thirdPartyContactPerson: beneficiariesData?.thirdPartyContactPerson
    ? thirdPartDefaultValues(beneficiariesData.thirdPartyContactPerson)
    : undefined,
});
export type BeneficiariesFormValues = ReturnType<
  typeof beneficiariesDefaultValues
>;

export function BeneficiariesForm() {
  const animateContainer = useRef(null);

  const beneficiariesData = useDrawerStore((state) => state.lip?.beneficiaries);

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: beneficiariesDefaultValues(beneficiariesData),
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

  const lipId = useDrawerStore((state) => state.lip?.id);
  const closeModal = useDrawerStore((state) => state.closeModal);

  return (
    <>
      <ModalBody>
        <Form
          id="healt-questionnaire-form"
          onSubmit={async (values) => {
            invariant(lipId, "lipId is required");
            if (values.nomination === "beneficiaries") {
              if (
                values.beneficiaries?.reduce(
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

              values.beneficiaries.forEach((beneficiary, index) => {
                if (
                  !fiscalCodeMatchDataValidator(
                    {
                      name: beneficiary.name,
                      surname: beneficiary.surname,
                      gender: beneficiary.gender === "male" ? "M" : "F",
                      day: getDate(beneficiary.birthDate),
                      month: getMonth(beneficiary.birthDate) + 1,
                      year: getYear(beneficiary.birthDate),
                      birthplace: beneficiary.birthPlace.city,
                      birthplaceProvincia: beneficiary.birthPlace.province,
                    },
                    beneficiary.fiscalCode,
                  )
                ) {
                  throw {
                    [`beneficiaries.${index}.fiscalCode`]: {
                      type: "fcMatch",
                      message:
                        "Il codice fiscale non corrisponde ai dati inseriti",
                    },
                  };
                }
              });

              const fiscalCodes = new Set<string>();
              values.beneficiaries.forEach((beneficiary) => {
                if (fiscalCodes.has(beneficiary.fiscalCode)) {
                  throw {
                    root: {
                      type: "duplicate",
                      message:
                        "Due Beneficiari non possono avere lo stesso codice fiscale",
                    },
                  };
                }
                fiscalCodes.add(beneficiary.fiscalCode);
              });
            }

            if (values.thirdParty && values.thirdPartyContactPerson) {
              if (
                !fiscalCodeMatchDataValidator(
                  {
                    name: values.thirdPartyContactPerson.name,
                    surname: values.thirdPartyContactPerson.surname,
                    gender:
                      values.thirdPartyContactPerson.gender === "male"
                        ? "M"
                        : "F",
                    day: getDate(values.thirdPartyContactPerson.birthDate),
                    month:
                      getMonth(values.thirdPartyContactPerson.birthDate) + 1,
                    year: getYear(values.thirdPartyContactPerson.birthDate),
                    birthplace: values.thirdPartyContactPerson.birthPlace.city,
                    birthplaceProvincia:
                      values.thirdPartyContactPerson.birthPlace.province,
                  },
                  values.thirdPartyContactPerson.fiscalCode,
                )
              ) {
                throw {
                  ["thirdPartyContactPerson.fiscalCode"]: {
                    type: "fcMatch",
                    message:
                      "Il codice fiscale non corrisponde ai dati inseriti",
                  },
                };
              }
            }

            const updatedContractor = await updateBeneficiaries(values, lipId);

            if (updatedContractor.status !== "success") {
              throw {
                root: {
                  type: "server",
                  message: updatedContractor.message,
                },
              };
            }

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
                    onChange={(value) => {
                      if (value === "beneficiaries") {
                        formMethods.setValue(
                          "beneficiaries",
                          beneficiariesData?.beneficiaries
                            ? beneficiariesData?.beneficiaries.map(
                                beneficiaryDefaultValues,
                              )
                            : [beneficiaryDefaultValues()],
                        );
                      } else {
                        formMethods.setValue("beneficiaries", undefined);
                      }
                    }}
                    validation={{required: "Scegli i Beneficiari"}}
                  />
                </FormGroup>
              </Col>
            </Row>
            {nominationValue === "beneficiaries" ? (
              <>
                {fields.map((field, index) => {
                  const pepCheckValue = formMethods.watch(
                    `beneficiaries.${index}.pep.check`,
                  );
                  const pepResponseValue = formMethods.watch(
                    `beneficiaries.${index}.pep.response`,
                  );
                  const relationshipCheckValue = formMethods.watch(
                    `beneficiaries.${index}.relationship.check`,
                  );

                  return (
                    <Card key={field.id}>
                      <CardHeader>
                        <h4 className="w-100 mb-0 py-2">
                          Beneficiario {index + 1}
                        </h4>
                      </CardHeader>
                      <CardBody>
                        <Row className="row-gap-3">
                          <div className="d-flex">
                            <h4 className="w-100 me-auto">Anagrafica</h4>
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
                          <Col className="d-flex" xs={12} md={4}>
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
                                  required:
                                    "Inserisci il cognome del Beneficiario",
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col className="d-flex" xs={12} md={4}>
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
                                  required:
                                    "Inserisci il nome del Beneficiario",
                                }}
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
                                      message:
                                        "La quota dev'erre maggiore di 0",
                                    },
                                    max: {
                                      value: 100,
                                      message:
                                        "La quota dev'erre minore di 100",
                                    },
                                  }}
                                />
                                <InputGroup.Text>%</InputGroup.Text>
                              </InputGroup>
                            </FormGroup>
                          </Col>
                          <Col className="d-flex" xs={12} md={4} lg={5}>
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
                          <Col className="d-flex" xs={12} md={8} lg={7}>
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
                                disableIf={[
                                  `beneficiaries.${index}.birthPlace.city`,
                                ]}
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
                          <Col className="d-flex" xs={12} sm={8} md={9}>
                            <FormGroup
                              controlId={`beneficiaries.${index}.fiscalCode`}
                              as={BorderFeedback}
                            >
                              <FormLabel>Codice Fiscale</FormLabel>
                              <FieldError />
                              <InputField<
                                BeneficiariesFormValues,
                                `beneficiaries.${number}.fiscalCode`
                              >
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
                          <Col className="d-flex" xs={12} sm={4} md={3}>
                            <FormGroup
                              controlId={`beneficiaries.${index}.gender`}
                              as={BorderFeedback}
                            >
                              <FormLabel>Genere</FormLabel>
                              <FieldError />
                              <CheckGroup
                                type="radio"
                                options={genderOptions}
                                validation={{
                                  required:
                                    "Scegliere il genere del beneficiario",
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <h4>Documento d'identità:</h4>
                          <IdentityDocumentForm
                            name={`beneficiaries.${index}.identityDocument`}
                          />
                          <h4>Contatti:</h4>
                          <Col className="d-flex" xs={12} sm={8} md={9}>
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
                                  required:
                                    "Inserisci l'indirizzo del Contraente",
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col className="d-flex" xs={12} sm={4} md={3}>
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
                                  required:
                                    "Inserisci il n° civico del Contraente",
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
                                disableIf={[
                                  `beneficiaries.${index}.place.city`,
                                ]}
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
                                  required:
                                    "Inserisci l'indirizzo del Beneficiario",
                                  minLength: {
                                    value: 5,
                                    message:
                                      "Il CAP deve essere di 5 caratteri",
                                  },
                                  maxLength: {
                                    value: 5,
                                    message:
                                      "Il CAP deve essere di 5 caratteri",
                                  },
                                }}
                                normalize={(value) => value.replace(/\D/g, "")}
                              />
                            </FormGroup>
                          </Col>
                          <Col className="d-flex" xs={12} md={6}>
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
                                  required:
                                    "Inserisci il telefono del Beneficiario",
                                }}
                                normalize={onlyNumbersNormalizer}
                              />
                            </FormGroup>
                          </Col>
                          <Col className="d-flex" xs={12} md={6}>
                            <FormGroup
                              controlId={`beneficiaries.${index}.email`}
                              as={BorderFeedback}
                            >
                              <FormLabel>Email</FormLabel>
                              <FieldError />
                              <InputField<
                                BeneficiariesFormValues,
                                `beneficiaries.${number}.email`
                              >
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
                                      if (!emailValidator(value)) {
                                        return "L'email inserita non è valida";
                                      }
                                    },
                                  },
                                }}
                                normalize={emailNormalizer}
                              />
                            </FormGroup>
                          </Col>
                          <h4>Informazioni aggiuntive:</h4>
                          <Col className="d-flex" xs={12} md={6}>
                            <FormGroup
                              controlId={`beneficiaries.${index}.pep.check`}
                              as={BorderFeedback}
                            >
                              <FormLabel>
                                È Persona Politicamente Esposta
                              </FormLabel>
                              <FieldError />
                              <CheckGroup
                                type="radio"
                                onChange={(value) => {
                                  if (value === "no") {
                                    formMethods.setValue(
                                      `beneficiaries.${index}.pep.response`,
                                      "" as Relationship,
                                    );
                                  }
                                  void formMethods.trigger(
                                    `beneficiaries.${index}.pep.response`,
                                  );
                                }}
                                inline
                                options={yesNoOptions}
                                validation={{
                                  required: "Seleziona un'opzione",
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col className="d-flex" xs={12} md={6}>
                            <Stack gap={3}>
                              <FormGroup
                                controlId={`beneficiaries.${index}.pep.response`}
                                disabled={pepCheckValue !== "yes"}
                                as={BorderFeedback}
                              >
                                <FormLabel>Specificare la relazione</FormLabel>
                                <FieldError />
                                <SelectField
                                  placeholder="Seleziona la relazione"
                                  disabled={pepCheckValue !== "yes"}
                                  options={relationshipOptions}
                                  validation={{
                                    validate: {
                                      required: (value, formValues) => {
                                        if (
                                          formValues.beneficiaries[index]?.pep
                                            .check === "yes" &&
                                          (!value || value.length === 0)
                                        ) {
                                          return "Seleziona la relazione";
                                        }
                                      },
                                    },
                                  }}
                                />
                              </FormGroup>
                              {pepResponseValue === "other" && (
                                <FormGroup
                                  controlId={`beneficiaries.${index}.pep.otherValue`}
                                  as={BorderFeedback}
                                >
                                  <FormLabel>
                                    Specificare la relazione
                                  </FormLabel>
                                  <InputField
                                    type="text"
                                    placeholder="Specificare la relazione"
                                    validation={{
                                      required:
                                        "Inserisci l'attività e professione esercitata",
                                    }}
                                  />
                                </FormGroup>
                              )}
                            </Stack>
                          </Col>
                          <Col className="d-flex" xs={12} md={6}>
                            <FormGroup
                              controlId={`beneficiaries.${index}.relationship.check`}
                              as={BorderFeedback}
                            >
                              <FormLabel>
                                Il beneficiario è un familiare
                              </FormLabel>
                              <FieldError />
                              <CheckGroup
                                type="radio"
                                onChange={(value) => {
                                  if (value === "yes") {
                                    formMethods.setValue(
                                      `beneficiaries.${index}.relationship.response`,
                                      "",
                                    );
                                  }
                                  void formMethods.trigger(
                                    `beneficiaries.${index}.relationship.response`,
                                  );
                                }}
                                inline
                                options={yesNoOptions}
                                validation={{
                                  required: "Seleziona un'opzione",
                                }}
                              />
                            </FormGroup>
                          </Col>
                          <Col className="d-flex" xs={12} md={6}>
                            <FormGroup
                              controlId={`beneficiaries.${index}.relationship.response`}
                              disabled={relationshipCheckValue !== "no"}
                              as={BorderFeedback}
                            >
                              <FormLabel>Specificare la relazione</FormLabel>
                              <FieldError />
                              <InputField
                                type="text"
                                placeholder="Specifica la relazione"
                                disabled={relationshipCheckValue !== "no"}
                                validation={{
                                  validate: {
                                    required: (value, formValues) => {
                                      if (
                                        formValues.beneficiaries[index]
                                          ?.relationship.check === "no" &&
                                        (!value || value.length === 0)
                                      ) {
                                        return "Specifica la relazione";
                                      }
                                    },
                                  },
                                }}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  );
                })}
                <Col xs={12}>
                  <div
                    className="d-inline-block"
                    title={
                      fields.length >= 5
                        ? "Puoi aggiungere al massimo cinque beneficiari"
                        : undefined
                    }
                  >
                    <Button
                      type="button"
                      variant="info"
                      disabled={fields.length >= 5}
                      onClick={() => append(beneficiaryDefaultValues())}
                      className="me-auto"
                    >
                      <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                      Aggiungi un Beneficiario
                    </Button>
                  </div>
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
              </>
            ) : nominationValue === "heirs" ? (
              <>
                <Alert variant="info" className="mb-0">
                  Ove non sia designato alcun Beneficiario, la prestazione
                  assicurativa sarà corrisposta in favore degli eredi
                  testamentari o, in mancanza di testamento, degli eredi
                  legittimi del Contraente-assicurato
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
                onChange={(value) => {
                  if (value.target.checked) {
                    formMethods.setValue(
                      "thirdPartyContactPerson",
                      thirdPartDefaultValues(),
                    );
                  } else {
                    formMethods.setValue("thirdPartyContactPerson", undefined);
                  }
                }}
              />
            </FormGroup>
            {thirdPartyValue && (
              <Card>
                <CardHeader>
                  <h4 className="w-100 mb-0 py-2">Referente terzo</h4>
                </CardHeader>
                <CardBody>
                  <Row className="row-gap-3">
                    <Col xs={12}>
                      <Alert variant="info" className="mb-0">
                        Il Contraente-Assicurato, per specifiche esigenze di
                        riservatezza, indica come referente terzo, diverso dai
                        Beneficiari, il soggetto di seguito indicato, al quale
                        la Compagnia farà riferimento in caso di decesso del
                        Contraente-Assicurato:
                      </Alert>
                    </Col>
                    <h4 className="w-100 me-auto">Anagrafica</h4>
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
                            required:
                              "Inserisci il cognome del referente terzo",
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
                            required: "Inserisci il nome del referente terzo",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="d-flex" xs={12} md={4} lg={5}>
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
                              "Inserisci la data di nascita del referente terzo",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="d-flex" xs={12} md={8} lg={7}>
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
                          disableIf={[
                            `thirdPartyContactPerson.birthPlace.city`,
                          ]}
                        />
                        <ComuneProvAutocompleteField
                          placeholder="Luogo di nascita"
                          validation={{
                            required:
                              "Inserisci il luogo di nascita del referente terzo",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <Col className="d-flex" xs={12} sm={8} md={9}>
                      <FormGroup
                        controlId={`thirdPartyContactPerson.fiscalCode`}
                        as={BorderFeedback}
                      >
                        <FormLabel>Codice Fiscale</FormLabel>
                        <FieldError />
                        <InputField<
                          BeneficiariesFormValues,
                          `thirdPartyContactPerson.fiscalCode`
                        >
                          type="text"
                          placeholder="Codice Fiscale"
                          normalize={upperCaseNormalizer}
                          validation={{
                            validate: {
                              required: (value) => {
                                if (!value) {
                                  return "Inserisci il codice fiscale del referente terzo";
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
                    <Col className="d-flex" xs={12} sm={4} md={3}>
                      <FormGroup
                        controlId={`thirdPartyContactPerson.gender`}
                        as={BorderFeedback}
                      >
                        <FormLabel>Genere</FormLabel>
                        <FieldError />
                        <CheckGroup
                          type="radio"
                          options={genderOptions}
                          validation={{
                            required: "Scegliere il genere del referente terzo",
                          }}
                        />
                      </FormGroup>
                    </Col>
                    <h4>Documento d'identità:</h4>
                    <IdentityDocumentForm
                      name={`thirdPartyContactPerson.identityDocument`}
                    />
                    <h4>Contatti:</h4>
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
                            required:
                              "Inserisci l'indirizzo del referente terzo",
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
                            required:
                              "Inserisci il n° civico del referente terzo",
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
                        <FieldError
                          name={`thirdPartyContactPerson.place.city`}
                        />
                        <FieldError
                          name={`thirdPartyContactPerson.place.province`}
                          disableIf={[`thirdPartyContactPerson.place.city`]}
                        />
                        <ComuneProvAutocompleteField
                          placeholder="Città di residenza"
                          onlyExisting
                          validation={{
                            required:
                              "Inserisci la città di residenza del referente terzo",
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
                            required:
                              "Inserisci l'indirizzo del referente terzo",
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
                            required:
                              "Inserisci il telefono del referente terzo",
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
                        <InputField<
                          BeneficiariesFormValues,
                          `thirdPartyContactPerson.email`
                        >
                          type="email"
                          placeholder="Email"
                          validation={{
                            validate: {
                              required: (value) => {
                                if (!value) {
                                  return "Inserisci l'email del referente terzo";
                                }
                              },
                              pattern: (value) => {
                                if (!emailValidator(value)) {
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
                </CardBody>
              </Card>
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
