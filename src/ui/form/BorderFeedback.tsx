import {cns} from "@/helpers/cns";
import {useValidationState} from "@/ui/form/hooks";
import {WithChildren} from "@/ui/types";
import {useContext} from "react";
import FormContext from "react-bootstrap/FormContext";
import invariant from "tiny-invariant";
import styles from "./BorderFeedback.module.scss";

interface BorderFeedbackProps extends WithChildren {
  disabled?: boolean;
  name?: string;
  validationStyle?: boolean;
}

export function BorderFeedback({
  children,
  disabled,
  name,
  validationStyle = true,
}: BorderFeedbackProps) {
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  const {isInvalid, isValid} = useValidationState(controlName);

  return (
    <div
      className={cns([
        styles.base,
        disabled && styles.isDisabled,
        validationStyle && !disabled && isInvalid && styles.isInvalid,
        validationStyle && !disabled && isValid && styles.isValid,
      ])}
    >
      {children}
    </div>
  );
}
