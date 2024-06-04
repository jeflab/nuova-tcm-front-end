//@Fabio: non so se sia il posto migliore dove inserire questo helper
// L'obiettivo sarebbe avere un punto dove inserire alcune logiche di validazione
// di una lip per evitare duplicazione del codice

import {Lip} from "@/models/entities/lip";

export class LipValidator {
  den = new LipDenValidator(this.lip);

  constructor(private lip?: Lip | null) {}
}

class LipDenValidator {
  constructor(private lip?: Lip | null) {}

  get valid() {
    return this.validDuration && this.validExpectation;
  }

  get validDuration(): boolean {
    return !!this.lip?.den && this.lip?.den.duration.response === "long_term";
  }

  get validExpectation(): boolean {
    return (
      !!this.lip?.den &&
      (["capital_and_personal_protection"] as const).some((value) =>
        this.lip?.den?.expectations.response.includes(value),
      )
    );
  }
}
