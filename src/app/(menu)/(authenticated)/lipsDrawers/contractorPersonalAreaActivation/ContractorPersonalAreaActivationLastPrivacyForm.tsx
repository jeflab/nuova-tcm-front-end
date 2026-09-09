"use client";

import {getLastPrivacyQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {useSuspenseLip} from "@/app/(menu)/(authenticated)/lipsDrawers/useSuspenseLip";
import {cns} from "@/helpers/cns";
import {PDFType} from "@/models/entities/esign";
import {isLip} from "@/models/entities/lip";
import RequestOTPModal from "@/ui/eSign/RequestOTPModal";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckboxField} from "@/ui/form/CheckboxField";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {SubmitButton} from "@/ui/form/SubmitButton";
import {useDrawerModal} from "@/ui/ModalContext";
import {faFileSignature, faSpinner} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useState} from "react";
import {Alert, FormGroup} from "react-bootstrap";
import {useForm} from "react-hook-form";
import styles from "./ContractorPersonalAreaActivationLastPrivacyForm.module.scss";

export function ContractorPersonalAreaActivationLastPrivacyForm() {
  const {
    data: {lip},
  } = useSuspenseLip();
  const {data: lastPrivacy} = useSuspenseQuery(getLastPrivacyQuery());
  const formMethods = useForm({
    mode: "onChange",
  });
  const [eSignModalOpen, setESignModalOpen] = useState(false);
  const {closeModal} = useDrawerModal();

  return (
    <Form
      onSubmit={() => {
        setESignModalOpen(true);
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
        {isLip(lip) && (
          <RequestOTPModal
            onHide={() => {
              setESignModalOpen(false);
            }}
            onESignComplete={async () => {
              setESignModalOpen(false);
              closeModal();
            }}
            personalData={lip.contractor}
            pdfType={PDFType.Privacy}
            show={eSignModalOpen}
            payload={{values: formMethods.watch()}}
            lipId={lip.id}
            whoESign="contractor"
          />
        )}
      </div>
    </Form>
  );
}
