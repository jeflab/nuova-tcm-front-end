import {cns} from "@/helpers/cns";
import {WithChildren} from "./types";
import styles from "./IconStack.module.scss";

interface IconStackProps extends WithChildren {
  className?: string;
}

export function IconStack({children, className}: IconStackProps) {
  return (
    <span className={cns(className, "fa-stack", styles.fixSize)}>
      {children}
    </span>
  );
}
