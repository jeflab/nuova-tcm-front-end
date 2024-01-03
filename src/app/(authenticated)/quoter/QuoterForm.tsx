"use client";

import {ComplementaryCoverages} from "@/app/(authenticated)/quoter/ComplementaryCoverages";
import {cns} from "@/helpers/cns";
import {Form} from "@/ui/form/Form";
import {SubmitButton} from "@/ui/form/SubmitButton";
import {faQuestion, faSpinner} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Coverages} from "./Coverages";
import {InsuredData} from "./InsuredData";

export function QuoterForm() {
  return (
    <Form
      onSubmit={async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log(values);
      }}
      defaultValues={{
        death: 20_000,
        accidentalDeath: false,
        trafficAccidentalDeath: false,
        exemptionFromPaying: false,
        pti: {enabled: false, coverage: 20_000},
        cancer: {enabled: false, coverage: 20_000},
        ptd: {enabled: false, coverage: 20_000},
      }}
      className="vstack gap-3 align-items-start"
    >
      <InsuredData />
      <Coverages />
      <ComplementaryCoverages />
      <SubmitButton>
        {(isLoggingIn) => (
          <>
            <FontAwesomeIcon
              icon={isLoggingIn ? faSpinner : faQuestion}
              className={cns("me-2", isLoggingIn && "fa-spin")}
            />
            Calcola preventivo
          </>
        )}
      </SubmitButton>
    </Form>
  );
}
