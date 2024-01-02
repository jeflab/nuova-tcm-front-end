import {cns} from "@/helpers/cns";
import {useValidationState} from "@/ui/form/hooks";
import {WithChildren} from "@/ui/types";
import {useContext} from "react";
import FormContext from "react-bootstrap/FormContext";
import {useFormContext} from "react-hook-form";
import invariant from "tiny-invariant";
import styles from "./BorderFeedback.module.scss";

interface BorderFeedbackProps extends WithChildren {
  name?: string;
  validationStyle?: boolean;
}

export function BorderFeedback({
  children,
  name,
  validationStyle = true,
}: BorderFeedbackProps) {
  const {
    formState: {errors, dirtyFields},
  } = useFormContext();
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  const {isInvalid, isValid} = useValidationState(controlName);

  return (
    <div
      className={cns([
        styles.base,
        validationStyle && isInvalid && styles.isInvalid,
        validationStyle && isValid && styles.isValid,
      ])}
    >
      {children}
    </div>
  );
}
