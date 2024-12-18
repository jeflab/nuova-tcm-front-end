"use client";

import {updateQuotation} from "@/app/(menu)/(authenticated)/lips/[id]/actions";
import {useStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {YesNoAnswer} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {getQuote} from "@/app/(menu)/(authenticated)/quoter/actions";
import {Advantages} from "@/app/(menu)/(authenticated)/quoter/Advantages";
import {ComplementaryCoverages} from "@/app/(menu)/(authenticated)/quoter/ComplementaryCoverages";
import {Coverages} from "@/app/(menu)/(authenticated)/quoter/Coverages";
import {getCoverageDuration} from "@/app/(menu)/(authenticated)/quoter/helpers";
import {InsuredData} from "@/app/(menu)/(authenticated)/quoter/InsuredData";
import {QuoterFormValues} from "@/app/(menu)/(authenticated)/quoter/QuoterForm";
import styles from "@/app/(menu)/(authenticated)/quoter/QuoterForm.module.scss";
import {cns} from "@/helpers/cns";
import {dbDateString} from "@/helpers/dates";
import {normalizeError} from "@/helpers/errors";
import {Currency} from "@/ui/Currency";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {
  faArrowRotateLeft,
  faCalculator,
  faSave,
  faSpinner,
  faXmark,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {Alert, Button, ModalBody, ModalFooter, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import invariant from "tiny-invariant";

export function QuoteForm() {
  const [quotation, setQuotation] = useState<{
    premium: number;
    originalPremium: number;
  }>();
  const [isSaving, setIsSaving] = useState(false);
  const [firstTry, setFirstTry] = useState(true);

  const quoteData = useStore((state) => state.lip?.quotation);
  const insuredBirthDate = useStore((state) => state.lip?.insured?.birthDate);
  const income = useStore((state) => state.lip?.den?.income);
  const lipId = useStore((state) => state.lip?.id);
  const closeModal = useStore((state) => state.closeModal);
  const isHealthQuestionnaireCompiled = useStore(
    (state) => state.lip?.healthcareQuestionnaire,
  );

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: {
      smoker: quoteData?.smoker ?? ("" as YesNoAnswer),
      death: quoteData?.death.toString() ?? "20000",
      accidentalDeath: quoteData?.accidentalDeath ?? false,
      trafficAccidentalDeath: quoteData?.trafficAccidentalDeath ?? false,
      exemptionFromPaying: quoteData?.exemptionFromPaying ?? false,
      tpi: {
        enabled: quoteData?.tpi.enabled ?? false,
        coverage: quoteData?.tpi.coverage.toString() ?? "0",
      },
      cancer: {
        enabled: quoteData?.cancer.enabled ?? false,
        coverage: quoteData?.cancer.coverage.toString() ?? "0",
      },
      tpd: {
        enabled: quoteData?.tpd.enabled ?? false,
        coverage: quoteData?.tpd.coverage.toString() ?? "0",
      },
      birthDate: dbDateString(insuredBirthDate),
    },
  });

  const tpiTpdCancerDirty = !!(
    formMethods.formState.dirtyFields.tpi ||
    formMethods.formState.dirtyFields.tpd ||
    formMethods.formState.dirtyFields.cancer
  );

  const handleSubmit = async (values: QuoterFormValues) => {
    let clientResponse: Awaited<ReturnType<typeof getQuote>>;
    try {
      clientResponse = await getQuote(values);
    } catch (error) {
      console.error(error);
      throw {
        root: {
          type: "server",
          message: "Errore imprevisto, riprova più tardi.",
        },
      };
    }

    if (clientResponse?.status !== "success") {
      throw {
        root: {type: "server", message: normalizeError(clientResponse).message},
      };
    }

    if (
      clientResponse.quotazione.premium >
      parseInt(income ?? "0", 10) * 0.125
    ) {
      throw {
        root: {
          type: "server",
          message:
            "Il premio annuo preventivato è superiore al 12,50% del reddito annuo netto. Riduci il capitale assicurato o deseleziona alcune garanzie per procedere ad una nuova quotazione.",
        },
      };
    }

    setQuotation(clientResponse.quotazione);
    setFirstTry(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    invariant(quotation, "premium required");
    invariant(lipId, "lipId required");

    const updateQuotationResponse = await updateQuotation(
      {
        ...formMethods.getValues(),
        ...quotation,
      },
      lipId,
      tpiTpdCancerDirty,
    );

    if (updateQuotationResponse?.status !== "success") {
      formMethods.setError("root", {
        type: "server",
        message: normalizeError(updateQuotationResponse).message,
      });
      setIsSaving(false);
      return;
    } else {
      closeModal();
      setIsSaving(false);
    }
  };

  const birthDate = formMethods.watch("birthDate");

  return (
    <>
      <ModalBody>
        <Form
          id="quote-form"
          onSubmit={handleSubmit}
          formMethods={formMethods}
          className="vstack gap-3"
          onChange={() => {
            if (formMethods.formState.isSubmitted) {
              setQuotation(undefined);
            }
          }}
        >
          <Row className="row-gap-3" xs={1} sm={2}>
            <InsuredData blockBirthDate />
            <Coverages />
            <Advantages
              premium={quotation?.premium ?? 0}
              duration={getCoverageDuration(birthDate)}
            />
            <ComplementaryCoverages />
          </Row>
          <FieldError
            name="root"
            as={Alert}
            variant="danger"
            className="mb-0 w-100"
          />
        </Form>
        {isHealthQuestionnaireCompiled && tpiTpdCancerDirty && (
          <Alert variant="warning" className="mt-3">
            <strong>Attenzione:</strong> Se modifichi le coperture{" "}
            <em>invalidità permanente da infortunio o malattia</em>,{" "}
            <em>cancro</em> o <em>perdita totale di autosufficienza</em>, dovrai
            ricompilare il questionario sanitario.
          </Alert>
        )}
      </ModalBody>
      <ModalFooter>
        <div className="me-auto">
          {formMethods.formState.isSubmitting ? (
            <>
              <FontAwesomeIcon icon={faSpinner} className="fa-spin" /> Calcolo
              in corso...
            </>
          ) : quotation ? (
            <>
              Premio mensile:{" "}
              <Currency className="h4 mb-0 d-inline-block">
                {quotation.premium / 12}
              </Currency>
            </>
          ) : firstTry ? (
            "Compila il form per avere il preventivo della polizza."
          ) : (
            "Clicca nuovamente calcolo preventivo per aggiornare il preventivo."
          )}
        </div>
        {quotation ? (
          <Button
            type="button"
            variant="cancel"
            onClick={() => {
              formMethods.reset();
              setQuotation(undefined);
            }}
            className={styles.rotateOnFocus}
          >
            <FontAwesomeIcon icon={faArrowRotateLeft} className="me-2" />
            Reset
          </Button>
        ) : (
          <Button type="button" variant="cancel" onClick={() => closeModal()}>
            <FontAwesomeIcon icon={faXmark} className="me-2" />
            Annulla
          </Button>
        )}
        {quotation ? (
          <Button type="button" variant="primary" onClick={handleSave}>
            {isSaving ? (
              <FontAwesomeIcon icon={faSpinner} className="fa-spin me-2" />
            ) : (
              <FontAwesomeIcon icon={faSave} className="me-2" />
            )}
            Accetta il preventivo e prosegui
          </Button>
        ) : (
          <Button type="submit" form="quote-form" variant="primary">
            <FontAwesomeIcon
              icon={
                formMethods.formState.isSubmitting ? faSpinner : faCalculator
              }
              className={cns(
                "me-2",
                formMethods.formState.isSubmitting && "fa-spin",
              )}
            />
            Calcola preventivo
          </Button>
        )}
      </ModalFooter>
    </>
  );
}
