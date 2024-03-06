"use client";

import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {Profile} from "@/entities/account";
import {Privacy} from "@/entities/privacy";
import {cns} from "@/helpers/cns";
import RequestOTPModal from "@/ui/eSign/RequestOTPModal";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckboxField} from "@/ui/form/CheckboxField";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {SubmitButton} from "@/ui/form/SubmitButton";
import {faFileSignature, faSpinner} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {redirect} from "next/navigation";
import {startTransition, useState} from "react";
import {Alert, FormGroup} from "react-bootstrap";
import styles from "./ContractorPersonalAreaActivationLastPrivacyForm.module.scss";
import {useForm} from "react-hook-form";

interface ContractorPersonalAreaActivationLastPrivacyFormProps {
  profile: Profile;
  lastPrivacy: Privacy;
}

export function ContractorPersonalAreaActivationLastPrivacyForm({
  profile,
  lastPrivacy,
}: ContractorPersonalAreaActivationLastPrivacyFormProps) {
  const formMethods = useForm({
    mode: "onChange",
  });
  const [esignModalOpen, setEsignModalOpen] = useState(false);
  const lip = useDrawerStore((state) => state.lip);

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
              Firma tu il consenso per il cliente
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
            onEsignComplete={() => {
              redirect(`/lips/${lip.id}`);
            }}
            personalData={lip.contractor}
            profile={profile}
            show={esignModalOpen}
            payload={{values: formMethods.watch()}}
            lipId={lip.id}
          />
        )}
      </div>
    </Form>
  );
}
