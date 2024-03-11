import {QuoterFormValues} from "@/app/(menu)/quoter/QuoterForm";
import {calendarYearAge} from "@/helpers/ages";
import {dbDateString} from "@/helpers/dates";
import {BorderFeedback} from "@/ui/form/BorderFeedback";
import {CheckGroup} from "@/ui/form/CheckGroup";
import {FieldError} from "@/ui/form/FieldError";
import {HelpText} from "@/ui/form/HelpText";
import {InputField} from "@/ui/form/InputField";
import {startOfYear} from "date-fns/startOfYear";
import {subYears} from "date-fns/subYears";
import {Col, FormGroup, FormLabel} from "react-bootstrap";
import {useFormContext} from "react-hook-form";

interface InsuredDataProps {
  blockBirthDate?: boolean;
}

export function InsuredData({blockBirthDate}: InsuredDataProps) {
  const {trigger, setValue} = useFormContext<QuoterFormValues>();
  return (
    <>
      <h3 className="w-100">Dati dell'assicurato</h3>
      <Col className="vstack column-gap-3">
        <FormGroup controlId="birthDate" as={BorderFeedback}>
          <FormLabel>Data di nascita</FormLabel>
          <HelpText>
            L'età dell'assicurato deve essere compresa tra 18 e 65 anni
          </HelpText>
          <FieldError />
          <InputField
            type="date"
            placeholder="Data di nascita"
            readOnly={blockBirthDate}
            plaintext={blockBirthDate}
            onChange={(event) => {
              trigger("tpi.coverage");
              if (
                calendarYearAge(event.currentTarget.value) >= 55 &&
                calendarYearAge(event.currentTarget.value) < 85
              ) {
                setValue("exemptionFromPaying", false, {shouldValidate: true});
                setValue("tpi.enabled", false, {shouldValidate: true});
                setValue("tpi.coverage", "", {shouldValidate: true});
              }
            }}
            max={dbDateString(subYears(Date(), 18))}
            min={dbDateString(startOfYear(subYears(Date(), 65)))}
            validation={{
              required: "Inserisci la data di nascita dell'assicurato",
              max: {
                value: dbDateString(subYears(Date(), 18)),
                message: "L'assicurato deve aver compiuto almeno 18 anni",
              },
              min: {
                value: dbDateString(startOfYear(subYears(Date(), 65))),
                message: "L'assicurato deve avere al massimo 65 anni",
              },
            }}
          />
        </FormGroup>
      </Col>
      <Col className="vstack column-gap-3">
        <FormGroup controlId="smoker" as={BorderFeedback}>
          <p className="mb-2 input-heading">Fumatore</p>
          <HelpText>
            L'assicurato ha fumato (sigarette, sigari, pipa o altro) negli
            ultimi 24 mesi, oppure ha smesso di fumare su consiglio medico?
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
      </Col>
    </>
  );
}
