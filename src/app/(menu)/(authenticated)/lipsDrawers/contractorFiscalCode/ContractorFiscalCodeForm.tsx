"use client";

import {checkIfFiscalCodeExists} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {useUpdateLipLocalDataMutation} from "@/app/(menu)/(authenticated)/lips/[id]/mutations";
import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {
  Gender,
  genderOptions,
  LipType,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {getAccountQuery} from "@/app/(menu)/(authenticated)/queries";
import {cns} from "@/helpers/cns";
import {dbDateString} from "@/helpers/dates";
import {normalizeError} from "@/helpers/errors";
import {getOptionsValues} from "@/helpers/getOptionsLabel";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {ComuneProvAutocompleteField} from "@/ui/form/ComuneProvAutocompleteField";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {
  upperCaseNormalizer,
  upperCaseWordsNormalizer,
} from "@/ui/form/normalizers";
import {required} from "@/ui/form/validators/common";
import {
  fiscalCodeMatchDataSuperRefine,
  fiscalCodeValidator,
} from "@/ui/form/validators/fiscalCode";
import {useDrawerModal} from "@/ui/ModalContext";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {zodResolver} from "@hookform/resolvers/zod";
import {useSuspenseQuery} from "@tanstack/react-query";
import {getDate} from "date-fns/getDate";
import {getMonth} from "date-fns/getMonth";
import {getYear} from "date-fns/getYear";
import {startOfYear} from "date-fns/startOfYear";
import {subYears} from "date-fns/subYears";
import {useParams, useRouter} from "next/navigation";
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
import {z} from "zod";

// Usiamo uno schema come validazione vista la complessità del form e la dipendenza del cf con gli altri campi
const ContractorFormSchema = (lipType: LipType | undefined) =>
  z
    .object({
      birthDate: z
        .string()
        .refine(required, "Inserisci la data di nascita del Contraente")
        .refine((value) => {
          const date = new Date(value);
          return date <= subYears(Date(), 18);
        }, "Il Contraente deve essere maggiorenne")
        .refine((value) => {
          if (lipType !== "self-insured") {
            return true;
          }

          const date = new Date(value);
          return date > startOfYear(subYears(Date(), 75));
        }, "L'età assicurativa del Contraente deve essere inferiore a 75 anni"),
      birthPlace: z.object({
        city: z
          .string()
          .refine(required, "Inserisci il comune di nascita del Contraente"),
        province: z
          .string()
          .refine(required, "Inserisci la provincia di nascita del Contraente"),
      }),
      fiscalCode: z
        .string()
        .refine(required, "Inserisci il codice fiscale del Contraente")
        .refine((value) => {
          return fiscalCodeValidator(value);
        }, "Codice fiscale non valido"),
      gender: z
        .string()
        .refine(required, "Inserisci il genere del Contraente")
        .and(
          z.enum(getOptionsValues(genderOptions), {
            error: () => ({
              message: "Il genere del Contraente non è valido",
            }),
          }),
        ),
      name: z.string().refine(required, "Inserisci il nome del Contraente"),
      surname: z
        .string()
        .refine(required, "Inserisci il cognome del Contraente"),
    })
    .superRefine((formValues, ctx) => {
      fiscalCodeMatchDataSuperRefine(
        {
          name: formValues.name,
          surname: formValues.surname,
          gender: formValues.gender === "male" ? "M" : "F",
          day: getDate(formValues.birthDate),
          month: getMonth(formValues.birthDate) + 1,
          year: getYear(formValues.birthDate),
          birthplace: formValues.birthPlace.city,
          birthplaceProvincia: formValues.birthPlace.province,
        },
        formValues.fiscalCode,
        ctx,
      );
    });

const contractorFiscalCodeDefaultValues = {
  birthDate: "",
  birthPlace: {
    city: "",
    province: "",
  },
  fiscalCode: "",
  gender: "" as Gender,
  name: "",
  surname: "",
};

export function ContractorFiscalCodeForm() {
  const router = useRouter();
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id);
  const {
    data: {lip},
  } = useSuspenseQuery(getLipQuery(lipId));
  const {
    data: {user: loggedUser},
  } = useSuspenseQuery(getAccountQuery());
  const {mutateAsync: updateLip} = useUpdateLipLocalDataMutation();

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: contractorFiscalCodeDefaultValues,
    resolver: zodResolver(ContractorFormSchema(lip.type)),
  });
  const {closeModal} = useDrawerModal();

  return (
    <>
      <ModalBody>
        <Form
          onSubmit={async (values) => {
            let checkIfFiscalCodeExistsResponse: Awaited<
              ReturnType<typeof checkIfFiscalCodeExists>
            >;
            invariant(lip.type, "lipType is required");
            invariant(lip.contractor, "lip.contractor is required");

            if (loggedUser.fiscalCode === values.fiscalCode) {
              throw {
                root: {
                  type: "server",
                  message: "Non puoi effettuare una proposta a te stesso",
                },
              };
            }

            try {
              checkIfFiscalCodeExistsResponse = await checkIfFiscalCodeExists(
                values.fiscalCode,
                lip.type,
              );
            } catch (error) {
              console.error(error);
              throw {
                root: {
                  type: "server",
                  message: "Errore imprevisto, riprova più tardi.",
                },
              };
            }

            // Possono verificarsi 4 casi:
            //  - success con lastLipContractor e contractor
            //  - success senza niente
            //  - error con messaggio "Utente già censito da un altro Advisor"
            //  - error con messaggio generico

            if (checkIfFiscalCodeExistsResponse?.status === "success") {
              if (
                !!checkIfFiscalCodeExistsResponse.lip &&
                !!checkIfFiscalCodeExistsResponse.lip.contractor
              ) {
                if (!lip) {
                  router.push(
                    `/lips/${checkIfFiscalCodeExistsResponse.lip.id}`,
                    {scroll: false},
                  );
                }
                closeModal();
                return;
              }

              const transformedValues = (({
                birthDate,
                birthPlace,
                ...rest
              }: typeof contractorFiscalCodeDefaultValues) => ({
                ...rest,
                birthDate: new Date(birthDate),
                birthPlace: birthPlace.city,
                birthProvince: birthPlace.province,
              }))(values);

              console.log({
                values,
                transformedValues,
              });

              await updateLip({
                lipId: "new",
                data: {
                  contractor: {...lip.contractor, ...transformedValues},
                },
              });

              closeModal();
              return;
            }
            // TODO: Sarebbe meglio avere un codice errore piùttosto che il messaggio come discriminante
            if (
              checkIfFiscalCodeExistsResponse?.message ===
              "Utente già censito da un altro Advisor"
            ) {
              await updateLip({
                lipId: "new",
                data: {contractorAlreadyRegistered: true},
              });
              closeModal();
              return;
            }

            throw {
              root: {
                type: "server",
                message: normalizeError(checkIfFiscalCodeExistsResponse)
                  .message,
              },
            };
          }}
          id="contractor-fiscal-code-form"
          formMethods={formMethods}
        >
          <Row className="row-gap-3">
            <Col xs={12}>
              <FormGroup controlId="fiscalCode" as={BorderFeedback}>
                <FormLabel>Codice Fiscale</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Codice Fiscale"
                  normalize={upperCaseNormalizer}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} lg={5}>
              <FormGroup controlId="surname" as={BorderFeedback}>
                <FormLabel>Cognome</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Cognome"
                  normalize={upperCaseWordsNormalizer}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} lg={5}>
              <FormGroup controlId="name" as={BorderFeedback}>
                <FormLabel>Nome</FormLabel>
                <FieldError />
                <InputField
                  type="text"
                  placeholder="Nome"
                  normalize={upperCaseWordsNormalizer}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} md={3} lg={2}>
              <FormGroup controlId="gender" as={BorderFeedback}>
                <FormLabel>Genere</FormLabel>
                <FieldError />
                <CheckGroup type="radio" options={genderOptions} />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6} md={4} lg={5}>
              <FormGroup controlId="birthDate" as={BorderFeedback}>
                <FormLabel>Data di nascita</FormLabel>
                <FieldError />
                <InputField
                  type="date"
                  placeholder="Data di nascita"
                  max={dbDateString(subYears(Date(), 18))}
                  min={
                    lip.type === "self-insured"
                      ? dbDateString(startOfYear(subYears(Date(), 75)))
                      : "1900-01-01"
                  }
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} md={5} lg={7}>
              <FormGroup controlId="birthPlace" as={BorderFeedback}>
                <FormLabel>Luogo di nascita</FormLabel>
                <FieldError name="birthPlace.city" />
                <FieldError
                  name="birthPlace.province"
                  disableIf={["birthPlace.city"]}
                />
                <ComuneProvAutocompleteField />
              </FormGroup>
            </Col>
            <Col>
              <FieldError
                name="root"
                as={Alert}
                variant="danger"
                className="mb-0 w-100 px-3"
              />
              <FieldError
                name="fcMatch"
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
          Controlla codice fiscale e prosegui
        </Button>
      </ModalFooter>
    </>
  );
}
