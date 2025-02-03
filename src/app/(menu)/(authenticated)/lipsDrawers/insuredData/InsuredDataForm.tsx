"use client";

import {
  addInsuredData,
  updatePersonalData,
} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {
  Gender,
  genderOptions,
  InsuredRelationship,
  insuredRelationshipOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {cns} from "@/helpers/cns";
import {dbDateString} from "@/helpers/dates";
import {normalizeError} from "@/helpers/errors";
import {Nullable, Nullish} from "@/helpers/TypesHelper";
import {Lip} from "@/models/entities/lip";
import {PersonalData} from "@/models/entities/personalData";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {CitizenshipAutocompleteField} from "@/ui/form/CitizenshipAutocompleteField";
import {ComuneProvAutocompleteField} from "@/ui/form/ComuneProvAutocompleteField";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {
  emailNormalizer,
  onlyNumbersNormalizer,
  upperCaseNormalizer,
  upperCaseWordsNormalizer,
} from "@/ui/form/normalizers";
import {emailValidator} from "@/ui/form/validators/email";
import {checkFiscalCodeDataConsistencyValidator} from "@/ui/form/validators/fiscalCode";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import * as Sentry from "@sentry/nextjs";
import {startOfYear} from "date-fns/startOfYear";
import {subYears} from "date-fns/subYears";
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
import "core-js/actual/array/to-sorted";
import {getDate} from "date-fns/getDate";
import {getMonth} from "date-fns/getMonth";
import {getYear} from "date-fns/getYear";

// Polyfill per safari 15.
let toSortedPolyfillNeeded = false;
if ([].toSorted === undefined) {
  Sentry.captureMessage("[].toSorted method is undefined. " + [].toSorted);
  toSortedPolyfillNeeded = true;
}

if (toSortedPolyfillNeeded) {
  Sentry.captureMessage("[].toSorted polyfill applied. " + [].toSorted);
}

function getDefaultValues(insured: Nullish<PersonalData>, lip: Nullable<Lip>) {
  return {
    insuredPersonalData: {
      birthDate: insured ? dbDateString(insured.birthDate) : "",
      birthPlace: {
        city: insured?.birthPlace ?? "",
        province: insured?.birthProvince ?? "",
      },
      fiscalCode: insured?.fiscalCode ?? "",
      gender: insured?.gender ?? ("" as Gender),
      name: insured?.name ?? "",
      surname: insured?.surname ?? "",
    },
    contact: {
      phone: insured?.phone ?? "",
      email: insured?.email ?? "",
    },
    citizenship: insured?.citizenship ?? "",
    secondCitizenship: insured?.secondCitizenship ?? "",
    residence: {
      place: {
        city: insured?.city ?? "",
        province: insured?.region ?? "",
      },
      streetName: insured?.address ?? "",
      streetNumber: insured?.streetNumber ?? "",
      zipCode: insured?.zipCode ?? "",
    },
    relationship:
      lip?.contractorInsuredRelationship ?? ("" as InsuredRelationship),
    relationshipOther: lip?.contractorInsuredRelationshipOther ?? "",
  };
}

export function InsuredDataForm() {
  const lipId = useStore((state) => state.lip?.id);
  const lip = useStore((state) => state.lip);
  const insured = lip?.insured;

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: getDefaultValues(insured, lip),
  });

  const relationshipValue = formMethods.watch("relationship");

  const closeModal = useStore((state) => state.closeModal);

  return (
    <>
      <ModalBody>
        <Form
          onSubmit={async (values) => {
            invariant(lipId, "Lip ID must be defined");
            const upsertedInsured = await (insured
              ? updatePersonalData(insured.id, lipId, values)
              : addInsuredData(lipId, values));

            if (upsertedInsured?.status !== "success") {
              throw {
                root: {
                  type: "server",
                  message: normalizeError(upsertedInsured).message,
                },
              };
            }

            closeModal();
          }}
          id="insured-data"
          formMethods={formMethods}
        >
          <Row className="row-gap-3">
            <h4 className="w-100">Anagrafica</h4>
            <Col xs={12}>
              <FormGroup
                controlId="insuredPersonalData.fiscalCode"
                as={BorderFeedback}
              >
                <FormLabel>Codice Fiscale</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Codice Fiscale"
                  normalize={upperCaseNormalizer}
                  validation={{
                    required: "Inserisci il codice fiscale dell'Assicurato",
                    validate: (value, values) =>
                      checkFiscalCodeDataConsistencyValidator(value, {
                        name: values.insuredPersonalData.name,
                        surname: values.insuredPersonalData.surname,
                        gender:
                          values.insuredPersonalData.gender === "male"
                            ? "M"
                            : "F",
                        day: getDate(values.insuredPersonalData.birthDate),
                        month:
                          getMonth(values.insuredPersonalData.birthDate) + 1,
                        year: getYear(values.insuredPersonalData.birthDate),
                        birthplace: values.insuredPersonalData.birthPlace.city,
                        birthplaceProvincia:
                          values.insuredPersonalData.birthPlace.province,
                      }),
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} lg={5}>
              <FormGroup
                controlId="insuredPersonalData.surname"
                as={BorderFeedback}
              >
                <FormLabel>Cognome</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Cognome"
                  normalize={upperCaseWordsNormalizer}
                  validation={{
                    required: "Inserisci il cognome dell'Assicurato",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} lg={5}>
              <FormGroup
                controlId="insuredPersonalData.name"
                as={BorderFeedback}
              >
                <FormLabel>Nome</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Nome"
                  normalize={upperCaseWordsNormalizer}
                  validation={{
                    required: "Inserisci il nome dell'Assicurato",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} md={3} lg={2}>
              <FormGroup
                controlId="insuredPersonalData.gender"
                as={BorderFeedback}
              >
                <FormLabel>Genere</FormLabel>
                <FieldError />
                <CheckGroup
                  type="radio"
                  options={genderOptions}
                  validation={{
                    required: "Inserisci il genere dell'Assicurato",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} md={4} lg={5}>
              <FormGroup
                controlId="insuredPersonalData.birthDate"
                as={BorderFeedback}
              >
                <FormLabel>Data di nascita</FormLabel>
                <FieldError />
                <InputField
                  type="date"
                  placeholder="Data di nascita"
                  max={dbDateString(subYears(Date(), 18))}
                  min={dbDateString(startOfYear(subYears(Date(), 64)))}
                  validation={{
                    required: "Inserisci la data di nascita dell'Assicurato",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} md={5} lg={7}>
              <FormGroup
                controlId="insuredPersonalData.birthPlace"
                as={BorderFeedback}
              >
                <FormLabel>Luogo di nascita</FormLabel>
                <FieldError name="insuredPersonalData.birthPlace.city" />
                <FieldError
                  name="insuredPersonalData.birthPlace.province"
                  disableIf={["insuredPersonalData.birthPlace.city"]}
                />
                <ComuneProvAutocompleteField
                  validation={{
                    required: "Inserisci il comune di nascita dell'Assicurato",
                  }}
                />
              </FormGroup>
            </Col>
            <h4 className="w-100">Contatti</h4>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="contact.phone" as={BorderFeedback}>
                <FormLabel>Cellulare</FormLabel>
                <FieldError />
                <InputField
                  type="tel"
                  placeholder="Cellulare dell'Assicurato"
                  validation={{
                    required: "Inserisci il Cellulare del Assicurato",
                  }}
                  normalize={onlyNumbersNormalizer}
                />
              </FormGroup>
            </Col>{" "}
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="contact.email" as={BorderFeedback}>
                <FormLabel>E-mail</FormLabel>
                <FieldError />
                <InputField
                  type="email"
                  placeholder="Email dell'Assicurato"
                  validation={{
                    validate: {
                      required: (value) => {
                        if (!value) {
                          return "Inserisci l'email dell'Assicurato";
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
            <h4 className="w-100">Nazionalità</h4>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="citizenship" as={BorderFeedback}>
                <FormLabel>Nazionalità</FormLabel>
                <FieldError />
                <CitizenshipAutocompleteField
                  onChange={() => {
                    formMethods.trigger("secondCitizenship");
                  }}
                  placeholder="Nazionalità"
                  validation={{
                    required: "Inserisci la nazionalità dell'Assicurato",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="secondCitizenship" as={BorderFeedback}>
                <FormLabel>Seconda nazionalità</FormLabel>
                <FieldError />
                <CitizenshipAutocompleteField
                  placeholder="Seconda nazionalità"
                  validation={{
                    validate: {
                      unique: (value, values) => {
                        if (value === values.citizenship) {
                          return "Le nazionalità non possono essere uguali";
                        }
                      },
                    },
                  }}
                />
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
                    required: "Inserisci l'indirizzo dell'Assicurato",
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
                    required: "Inserisci il n° civico dell'Assicurato",
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
                  onlyItalian
                  validation={{
                    required: "Inserisci la città di residenza dell'Assicurato",
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
                    required: "Inserisci l'indirizzo dell'Assicurato",
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
            <h4 className="w-100">Rapporto con il Contraente</h4>
            <Col className="d-flex">
              <FormGroup controlId="relationship" as={BorderFeedback}>
                <FormLabel>Rapporto con il Contraente</FormLabel>
                <FieldError />
                <CheckGroup
                  type="radio"
                  options={insuredRelationshipOptions}
                  validation={{
                    required:
                      "Inserisci il rapporto che l'Assicurato ha con il Contraente",
                  }}
                />
              </FormGroup>
            </Col>
            {relationshipValue === "other" && (
              <Col className="d-flex" sm={6}>
                <FormGroup controlId="relationshipOther" as={BorderFeedback}>
                  <FormLabel>Specificare la relazione</FormLabel>
                  <InputField
                    type="text"
                    placeholder="Specificare la relazione"
                    validation={{
                      required:
                        "Specifica il rapporto che l'Assicurato ha con il Contraente",
                    }}
                  />
                </FormGroup>
              </Col>
            )}
          </Row>
          <FieldError
            name="root"
            as={Alert}
            variant="danger"
            className="mb-0 mt-3 w-100"
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="cancel" onClick={() => closeModal()}>
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          Annulla
        </Button>
        <Button type="submit" variant="primary" form="insured-data">
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
