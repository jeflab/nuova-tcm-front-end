"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {YesNoAnswer} from "@/helpers/TypesHelper";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {HelpText} from "@/ui/form/HelpText";
import {faSave, faSpinner, faXmark} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button, FormGroup, ModalBody, ModalFooter} from "react-bootstrap";
import {useForm} from "react-hook-form";

const healthQuestionnaireDefaultValues = {
  feelingGood: "" as YesNoAnswer,
};
export function HealthQuestionnaireForm() {
  const formMethods = useForm({
    mode: "onChange",
    defaultValues: healthQuestionnaireDefaultValues,
  });

  const closeModal = useDrawerStore((state) => state.closeModal);
  const updateHealthQuestionnaire = useDrawerStore(
    (state) => state.updateHealthQuestionnaire,
  );

  return (
    <>
      <ModalBody>
        <Form
          id="healt-questionnaire-form"
          onSubmit={(values) => {
            updateHealthQuestionnaire({
              feelingGood: values.feelingGood === "yes",
            });
            closeModal();
          }}
          formMethods={formMethods}
          className="vstack gap-3"
        >
          {" "}
          <FormGroup controlId="feelingGood" as={BorderFeedback}>
            <p className="mb-2 input-heading">Stato di salute</p>
            <HelpText>
              Il contraente dichiara di stare bene e di non avere alcuna
              patologia o malattia?
            </HelpText>
            <FieldError />
            <CheckGroup
              type="radio"
              inline
              options={[
                {label: "Sì", value: "yes"},
                {label: "No", value: "no"},
              ]}
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
