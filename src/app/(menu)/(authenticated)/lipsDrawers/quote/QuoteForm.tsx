"use client";

import {useUpdateQuotationMutation} from "@/app/(menu)/(authenticated)/lips/[id]/mutations";
import {getLipQuery} from "@/app/(menu)/(authenticated)/lips/[id]/queries";
import {isInsuredIdentificationValid} from "@/app/(menu)/(authenticated)/lipsDrawers/insuredIdentification/insuredIdentificationValidators";
import {YesNoAnswer} from "@/app/(menu)/(authenticated)/lipsDrawers/selectsOptions";
import {validateLipIdOrNotFound} from "@/app/(menu)/(authenticated)/lipsDrawers/validateLipIdOrNotFound";
import {getQuote} from "@/app/(menu)/(authenticated)/quoter/actions";
import {Advantages} from "@/app/(menu)/(authenticated)/quoter/Advantages";
import {ComplementaryCoverages} from "@/app/(menu)/(authenticated)/quoter/ComplementaryCoverages";
import {Coverages} from "@/app/(menu)/(authenticated)/quoter/Coverages";
import {InsuredData} from "@/app/(menu)/(authenticated)/quoter/InsuredData";
import {QuoterFormValues} from "@/app/(menu)/(authenticated)/quoter/QuoterForm";
import styles from "@/app/(menu)/(authenticated)/quoter/QuoterForm.module.scss";
import {cns} from "@/helpers/cns";
import {dbDateString} from "@/helpers/dates";
import {normalizeError} from "@/helpers/errors";
import {Currency} from "@/ui/Currency";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {useDrawerModal} from "@/ui/ModalContext";
import {
  faArrowRotateLeft,
  faCalculator,
  faSave,
  faSpinner,
  faXmark,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useSuspenseQuery} from "@tanstack/react-query";
import {useParams} from "next/navigation";
import {useState} from "react";
import {Alert, Button, Col, ModalBody, ModalFooter, Row} from "react-bootstrap";
import {useForm} from "react-hook-form";
import invariant from "tiny-invariant";
import {getCoverageDuration} from "./ComplementaryCoverages";

export function QuoteForm() {
  const lipId = validateLipIdOrNotFound(useParams<{id: string}>().id) as number;
  const {
    data: {lip},
  } = useSuspenseQuery(getLipQuery(lipId));
  const {closeModal} = useDrawerModal();
  const {mutateAsync: updateQuotation} = useUpdateQuotationMutation();

  if (!isInsuredIdentificationValid(lip)) {
    throw new Error("Lip non valida per la quotazione: assicurato non valido");
  }

  const [quotation, setQuotation] = useState<{
    premium: number;
    originalPremium: number;
    version: string;
  }>();
  const [isSaving, setIsSaving] = useState(false);
  const [firstTry, setFirstTry] = useState(true);

  const formMethods = useForm({
    mode: "onChange",
    defaultValues: {
      smoker: lip.quotation?.smoker ?? ("" as YesNoAnswer),
      death: lip.quotation?.death.toString() ?? "20000",
      accidentalDeath: lip.quotation?.accidentalDeath ?? false,
      trafficAccidentalDeath: lip.quotation?.trafficAccidentalDeath ?? false,
      exemptionFromPaying: lip.quotation?.exemptionFromPaying ?? false,
      tpi: {
        enabled: lip.quotation?.tpi.enabled ?? false,
        coverage: lip.quotation?.tpi.coverage.toString() ?? "0",
      },
      cancer: {
        enabled: lip.quotation?.cancer.enabled ?? false,
        coverage: lip.quotation?.cancer.coverage.toString() ?? "0",
      },
      tpd: {
        enabled: lip.quotation?.tpd.enabled ?? false,
        coverage: lip.quotation?.tpd.coverage.toString() ?? "0",
      },
      birthDate: dbDateString(lip.insured.birthDate),
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
    } catch {
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
      parseInt(lip.den.income ?? "0", 10) * 0.125
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

    try {
      await updateQuotation({
        lipId: lip.id,
        formData: {
          ...formMethods.getValues(),
          ...quotation,
        },
        shouldResetHealthQuestionnaire: tpiTpdCancerDirty,
      });
      closeModal();
    } catch (error) {
      formMethods.setError("root", {
        type: "server",
        message: normalizeError(
          error,
          "Errore imprevisto durante il salvataggio della quotazione, riprova più tardi.",
        ).message,
      });
      return;
    } finally {
      setIsSaving(false);
    }
  };

  const birthDate = formMethods.watch("birthDate");
  const deathValue = formMethods.watch("death");

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
            <Coverages income={Number(lip.den.income)} />
            <Advantages
              premium={quotation?.premium ?? 0}
              duration={getCoverageDuration("death", birthDate)}
            />
            {Number(deathValue) > 300_000 ? (
              <Col className="w-100">
                <Alert variant="warning" className="mb-0">
                  In virtù dell'importo del capitale assicurato per il caso di
                  morte superiore a € 300.000, la proposta di Polizza sarà
                  soggetta ad ulteriori approfondimenti.
                </Alert>
              </Col>
            ) : null}
            <ComplementaryCoverages lipType={lip.type} />
          </Row>
          <FieldError
            name="root"
            as={Alert}
            variant="danger"
            className="mb-0 w-100"
          />
        </Form>
        {lip.healthcareQuestionnaire && tpiTpdCancerDirty && (
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
