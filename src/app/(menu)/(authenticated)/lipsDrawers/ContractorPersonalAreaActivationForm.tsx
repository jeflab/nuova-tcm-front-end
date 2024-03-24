"use client";

import {activateContractor} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {fatcaQuestions} from "@/app/(menu)/(authenticated)/lipsDrawers/FatcaForm";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {cns} from "@/helpers/cns";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {emailNormalizer, onlyNumbersNormalizer} from "@/ui/form/normalizers";
import {email} from "@/ui/form/validators/email";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
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

const ContractorPersonalAreaActivationDefaultValues = {
  phone: "",
  email: "",
};

export function ContractorPersonalAreaActivationForm() {
  const router = useRouter();
  const formMethods = useForm({
    mode: "onChange",
    defaultValues: ContractorPersonalAreaActivationDefaultValues,
  });

  const closeModal = useDrawerStore((state) => state.closeModal);
  const preliminaryData = useDrawerStore((state) => state.preliminaryData);
  const updateLip = useDrawerStore((state) => state.updateLip);

  return (
    <>
      <ModalBody>
        <Form
          onSubmit={async (values) => {
            let activateContractorResponse: Awaited<
              ReturnType<typeof activateContractor>
            >;
            try {
              invariant(
                preliminaryData.contractorPersonalData,
                "Dati del cliente mancanti",
              );
              invariant(preliminaryData.fatca, "Dati FATCA mancanti");

              activateContractorResponse = await activateContractor({
                ...values,
                ...preliminaryData.contractorPersonalData,
                fatca: {
                  ...fatcaQuestions.fatcaCheck,
                  response: preliminaryData.fatca,
                },
              });
            } catch (e) {
              throw {
                root: {
                  type: "server",
                  message: "Errore imprevisto, riprova più tardi.",
                },
              };
            }

            if (activateContractorResponse.status === "failed") {
              throw {
                root: {
                  type: "server",
                  message: activateContractorResponse.message,
                },
              };
            }

            router.push(`/lips/${activateContractorResponse.lip?.id}`, {
              scroll: false,
            });
            closeModal();
          }}
          id="activate-contractor-form"
          formMethods={formMethods}
          className="vstack gap-3"
        >
          <Row className="row-gap-3">
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="phone" as={BorderFeedback}>
                <FormLabel>Cellulare</FormLabel>
                <FieldError />
                <InputField
                  type="tel"
                  placeholder="Cellulare"
                  validation={{
                    required: "Inserisci il Cellulare del Contraente",
                  }}
                  normalize={onlyNumbersNormalizer}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" xs={12} sm={6}>
              <FormGroup controlId="email" as={BorderFeedback}>
                <FormLabel>Email</FormLabel>
                <FieldError />
                <InputField
                  type="email"
                  placeholder="Email"
                  validation={{
                    validate: {
                      required: (value) => {
                        if (!value) {
                          return "Inserisci l'email del Contraente";
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
          <FieldError
            name="root"
            as={Alert}
            variant="danger"
            className="mb-0 w-100"
          />
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="cancel" onClick={() => closeModal()}>
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          Annulla
        </Button>
        <Button type="submit" variant="primary" form="activate-contractor-form">
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
