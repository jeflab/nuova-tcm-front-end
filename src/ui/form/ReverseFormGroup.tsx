import {cns} from "@/helpers/cns";
import {FormGroupProps} from "react-bootstrap";
import styles from "./ReverseFormGroup.module.scss";

type ReverseFormGroupProps = FormGroupProps;
export function ReverseFormGroup({
  children,
  className,
  ...props
}: ReverseFormGroupProps) {
  return (
    <div className={cns(className, styles.reverseFormGroup)} {...props}>
      {children}
    </div>
  );
}
