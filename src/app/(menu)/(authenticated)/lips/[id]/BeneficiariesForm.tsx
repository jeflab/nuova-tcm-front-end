"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
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
import {
  faSave,
  faSpinner,
  faUserPlus,
  faXmark,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Fragment} from "react";
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
    label: "Il contraente designa i seguenti beneficiari",
    value: "beneficiaries",
  },
  {
    label:
      "Il contraente designa come beneficiari gli eredi testamentari o, in assenza di testamento, gli eredi legittimi del contraente-assicurato in parti uguali fra loro",
    value: "heirs",
  },
] as const;
export type NominationOption = (typeof nominationOptions)[number]["value"];

const beneficiaryDefaultValues = {
  surname: "",
  name: "",
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
  beneficiaries: [beneficiaryDefaultValues],
};
export function BeneficiariesForm() {
  const formMethods = useForm({
    mode: "onChange",
    defaultValues: beneficiariesDefaultValues,
  });
  const {fields, append, remove} = useFieldArray({
    control: formMethods.control,
    name: "beneficiaries",
  });

  const closeModal = useDrawerStore((state) => state.closeModal);
  const updateBeneficiaries = useDrawerStore(
    (state) => state.updateBeneficiariesData,
  );

  const nomitationValue = formMethods.watch("nomination");

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
                    "La somma delle quote dei beneficiari deve essere uguale a 100",
                },
              };
            }
            updateBeneficiaries(values);
            closeModal();
          }}
          formMethods={formMethods}
          className="vstack gap-3"
        >
          <Row>
            <Col>
              <FormGroup controlId="nomination" as={BorderFeedback}>
                <FieldError />
                <CheckGroup
                  type="radio"
                  options={nominationOptions}
                  validation={{required: "Scegli i beneficiari"}}
                />
              </FormGroup>
            </Col>
          </Row>
          {nomitationValue === "beneficiaries" ? (
            <Row className="row-gap-3">
              {fields.map((field, index) => (
                <Fragment key={field.id}>
                  <div className="d-flex">
                    <h4 className="w-100 me-auto">Beneficiario {index + 1}</h4>
                    {fields.length > 1 && (
                      <Button
                        variant="danger"
                        type="button"
                        onClick={() => remove(index)}
                        className="text-nowrap"
                      >
                        Rimuovi beneficiario {index + 1}
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
                          required: "Inserisci il cognome del beneficiario",
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
                          required: "Inserisci il nome del beneficiario",
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
                            "Inserisci la data di nascita del beneficiario",
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
                            "Inserisci il luogo di nascita del beneficiario",
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
                                return "Inserisci il codice fiscale del beneficiario";
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
                      <FieldError name={`beneficiaries.${index}.place.city`} />
                      <FieldError
                        name={`beneficiaries.${index}.place.province`}
                        disableIf={[`beneficiaries.${index}.place.city`]}
                      />
                      <ComuneProvAutocompleteField
                        placeholder="Città di residenza"
                        onlyExisting
                        validation={{
                          required:
                            "Inserisci la città di residenza del beneficiario",
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
                          required: "Inserisci l'indirizzo del beneficiario",
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
                          required: "Inserisci il telefono del beneficiario",
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
                                return "Inserisci l'email del beneficiario";
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
                <Alert variant="info">
                  In caso di mancata designazione di beneficiari in forma
                  nominativa la compagnia potrà incontrare maggiori difficoltà
                  nell'identificazione e nella ricerca dei beneficiari.
                </Alert>
                <Alert variant="warning">
                  La modifica o la revoca dei beneficiari deve essere comunicata
                  alla compagnia.
                </Alert>
              </Col>
            </Row>
          ) : nomitationValue === "heirs" ? (
            <>
              <p>
                Ove non sia designato alcun beneficiario, la prestazione
                assicurativa sarà corrisposta in favore degli eredi testamentari
                o, in mancanza di testamento, degli eredi legittimi del
                contraente-assicurato
              </p>
              <Alert variant="info">
                In caso di mancata indicazione nominativa del beneficiario, la
                compagnia potrà incontrare, al decesso dell'assicurato, maggiori
                difficoltà nelle identificazione e nella ricerca del
                beneficiario
              </Alert>
            </>
          ) : null}
          <FieldError
            name="root"
            as={Alert}
            variant="danger"
            className="mb-0 w-100"
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        {nomitationValue === "beneficiaries" && (
          <Button
            type="button"
            variant="info"
            onClick={() => append(beneficiaryDefaultValues)}
            className="me-auto"
          >
            <FontAwesomeIcon icon={faUserPlus} className="me-2" />
            Aggiungi un beneficiario
          </Button>
        )}
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
