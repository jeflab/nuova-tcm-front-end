"use client";

import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {cns} from "@/helpers/cns";
import {PDFType} from "@/models/entities/esign";
import {Privacy} from "@/models/entities/privacy";
import {Tags} from "@/services/const";
import RequestOTPModal from "@/ui/eSign/RequestOTPModal";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckboxField} from "@/ui/form/CheckboxField";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {SubmitButton} from "@/ui/form/SubmitButton";
import {faFileSignature, faSpinner} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {startTransition, useState} from "react";
import {Alert, FormGroup} from "react-bootstrap";
import {useForm} from "react-hook-form";
import styles from "./ContractorPersonalAreaActivationLastPrivacyForm.module.scss";

interface ContractorPersonalAreaActivationLastPrivacyFormProps {
  lastPrivacy: Privacy;
}

export function ContractorPersonalAreaActivationLastPrivacyForm({
  lastPrivacy,
}: ContractorPersonalAreaActivationLastPrivacyFormProps) {
  const formMethods = useForm({
    mode: "onChange",
  });
  const [esignModalOpen, setEsignModalOpen] = useState(false);
  const lip = useStore((state) => state.lip);
  const closeModal = useStore((state) => state.closeModal);

  return (
    <Form
      onSubmit={() => {
        startTransition(() => {
          setEsignModalOpen(true);
        });
      }}
      formMethods={formMethods}
    >
      {lastPrivacy.data.map((section, index) => (
        <div className={styles.privacySection} key={index}>
          <div dangerouslySetInnerHTML={{__html: section.text}} />
          {section.questions.map((question) => (
            <FormGroup
              key={question.name}
              controlId={question.name}
              as={BorderFeedback}
              className="position-relative  mb-3"
              validationStyle={!!question.required}
            >
              <CheckboxField
                type={"checkbox"}
                label={question.text}
                stretchedLabel
                validation={
                  question.required
                    ? {required: "Campo obbligatorio"}
                    : undefined
                }
                validationStyle={!!question.required}
              />
            </FormGroup>
          ))}
        </div>
      ))}
      <FieldError
        name="root"
        as={Alert}
        variant="danger"
        className="mb-0 w-100"
      />
      <div>
        <SubmitButton>
          {(isSaving) => (
            <>
              <FontAwesomeIcon
                icon={isSaving ? faSpinner : faFileSignature}
                className={cns("me-2", isSaving && "fa-spin")}
              />
              Firma del Contraente
            </>
          )}
        </SubmitButton>
        {lip && (
          <RequestOTPModal
            onHide={() => {
              startTransition(() => {
                setEsignModalOpen(false);
              });
            }}
            onEsignComplete={async () => {
              setEsignModalOpen(false);
              closeModal();
            }}
            personalData={lip.contractor}
            pdfType={PDFType.Privacy}
            show={esignModalOpen}
            payload={{values: formMethods.watch()}}
            lipId={lip.id}
            tagToRevalidate={Tags.getLip(lip.id)}
          />
        )}
      </div>
    </Form>
  );
}
