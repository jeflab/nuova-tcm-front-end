"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {
  YesNoAnswer,
  yesNoOptions,
} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {HelpText} from "@/ui/form/HelpText";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  Button,
  Col,
  FormGroup,
  ModalBody,
  ModalFooter,
  Row,
} from "react-bootstrap";
import {useForm} from "react-hook-form";

export const fatcaQuestions = {
  fatcaCheck: {
    label: "Residenza USA",
    text: "Il Contraente è residente negli Stati Uniti d'America?",
    options: [
      {label: "Sì", value: "yes"},
      {label: "No", value: "no"},
    ],
  },
  residencyCheck: {
    label: "Residenza italiana",
    text: "Il Contraente è residente in Italia?",
    options: [
      {label: "Sì", value: "yes"},
      {label: "No", value: "no"},
    ],
  },
} as const;

export function FatcaForm() {
  const lipType = useStore((state) => state.preliminaryData?.type);
  const fatcaData = useStore((state) => state.preliminaryData.fatca);
  const italianResidencyData = useStore(
    (state) => state.preliminaryData.italianResidency,
  );
  const insuredFatcaData = useStore(
    (state) => state.preliminaryData.insuredFatca,
  );
  const insuredItalianResidencyData = useStore(
    (state) => state.preliminaryData.insuredItalianResidency,
  );

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: {
      fatcaCheck: (fatcaData ?? "") as YesNoAnswer,
      residencyCheck: (italianResidencyData ?? "") as YesNoAnswer,
      insuredFatcaCheck: (insuredFatcaData ?? "") as YesNoAnswer,
      insuredResidencyCheck: (insuredItalianResidencyData ?? "") as YesNoAnswer,
    },
  });

  const closeModal = useStore((state) => state.closeModal);
  const updatePreliminaryData = useStore(
    (state) => state.updatePreliminaryData,
  );

  return (
    <>
      <ModalBody>
        <Form
          id="fatca-form"
          onSubmit={(values) => {
            updatePreliminaryData({
              fatca: values.fatcaCheck,
              italianResidency: values.residencyCheck,
              insuredFatca: values.insuredFatcaCheck,
              insuredItalianResidency: values.insuredResidencyCheck,
            });
            closeModal();
          }}
          formMethods={formMethods}
          className="vstack gap-3"
        >
          <Row className="row-gap-3">
            <h4>Contraente</h4>
            <Col className="d-flex" sm={6}>
              <FormGroup controlId="fatcaCheck" as={BorderFeedback}>
                <p className="mb-2 input-heading">Residenza USA</p>
                <HelpText>
                  Il Contraente è residente negli Stati Uniti d'America?
                </HelpText>
                <FieldError />
                <CheckGroup
                  type="radio"
                  inline
                  options={yesNoOptions}
                  validation={{
                    required: "Seleziona un'opzione",
                  }}
                />
              </FormGroup>
            </Col>
            <Col className="d-flex" sm={6}>
              <FormGroup controlId="residencyCheck" as={BorderFeedback}>
                <p className="mb-2 input-heading">Residenza italiana</p>
                <HelpText>Il Contraente è residente in Italia?</HelpText>
                <FieldError />
                <CheckGroup
                  type="radio"
                  inline
                  options={yesNoOptions}
                  validation={{
                    required: "Seleziona un'opzione",
                  }}
                />
              </FormGroup>
            </Col>
            {lipType === "third-party-insured" && (
              <>
                <h4>Assicurato</h4>
                <Col className="d-flex" sm={6}>
                  <FormGroup controlId="insuredFatcaCheck" as={BorderFeedback}>
                    <p className="mb-2 input-heading">Residenza USA</p>
                    <HelpText>
                      L'Assicurato è residente negli Stati Uniti d'America?
                    </HelpText>
                    <FieldError />
                    <CheckGroup
                      type="radio"
                      inline
                      options={yesNoOptions}
                      validation={{
                        required: "Seleziona un'opzione",
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col className="d-flex" sm={6}>
                  <FormGroup
                    controlId="insuredResidencyCheck"
                    as={BorderFeedback}
                  >
                    <p className="mb-2 input-heading">Residenza italiana</p>
                    <HelpText>L'Assicurato è residente in Italia?</HelpText>
                    <FieldError />
                    <CheckGroup
                      type="radio"
                      inline
                      options={yesNoOptions}
                      validation={{
                        required: "Seleziona un'opzione",
                      }}
                    />
                  </FormGroup>
                </Col>
              </>
            )}
          </Row>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" variant="cancel" onClick={() => closeModal()}>
          <FontAwesomeIcon icon={faXmark} className="me-2" />
          Annulla
        </Button>
        <Button type="submit" variant="primary" form="fatca-form">
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
