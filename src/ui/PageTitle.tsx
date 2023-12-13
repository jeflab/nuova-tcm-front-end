import {WithChildren} from "./types";
import styles from "./PageTitle.module.scss";

export function PageTitle({children}: WithChildren) {
  return <h2 className={styles.pageTitle}>{children}</h2>;
}
