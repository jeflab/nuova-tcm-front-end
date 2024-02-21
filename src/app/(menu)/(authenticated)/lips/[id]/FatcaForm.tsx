"use client";

import {pepRelations} from "@/app/(menu)/(authenticated)/lips/[id]/ContractorDataForm";
import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {HelpText} from "@/ui/form/HelpText";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button, FormGroup, ModalBody, ModalFooter} from "react-bootstrap";
import {useForm} from "react-hook-form";

export const fatcaQuestions = {
  fatcaCheck: {
    label: "Residenza USA",
    text: "Il contraente è residente negli Stati Uniti d'America?",
    options: [
      {label: "Sì", value: "yes"},
      {label: "No", value: "no"},
    ],
  },
} as const;

const fatcaDefaultValues = {
  fatcaCheck:
    "" as (typeof fatcaQuestions)["fatcaCheck"]["options"][number]["value"],
};

export function FatcaForm() {
  const formMethods = useForm({
    mode: "onChange",
    defaultValues: fatcaDefaultValues,
  });

  const closeModal = useDrawerStore((state) => state.closeModal);
  const updatePreliminaryData = useDrawerStore(
    (state) => state.updatePreliminaryData,
  );

  return (
    <>
      <ModalBody>
        <Form
          id="fatca-form"
          onSubmit={(values) => {
            updatePreliminaryData({fatca: values.fatcaCheck});
            closeModal();
          }}
          formMethods={formMethods}
          className="vstack gap-3"
        >
          <FormGroup controlId="fatcaCheck" as={BorderFeedback}>
            <p className="mb-2 input-heading">
              {fatcaQuestions.fatcaCheck.label}
            </p>
            <HelpText>{fatcaQuestions.fatcaCheck.text}</HelpText>
            <FieldError />
            <CheckGroup
              type="radio"
              inline
              options={fatcaQuestions.fatcaCheck.options}
              validation={{
                required: "Seleziona un'opzione",
              }}
            />
          </FormGroup>
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
