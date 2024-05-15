import {cns} from "@/helpers/cns";
import {WithChildren} from "./types";
import styles from "./IconStack.module.scss";

interface IconStackProps extends WithChildren {
  className?: string;
  size?: "xl";
}

export function IconStack({children, className, size}: IconStackProps) {
  return (
    <span
      className={cns(
        className,
        "fa-stack",
        styles.fixSize,
        size && styles[size],
      )}
    >
      {children}
    </span>
  );
}
