import {ReactNode} from "react";
import styles from "./layout.module.scss";

interface NoMenuLayoutProps {
  children: ReactNode;
}

export default function NoMenuLayout({children}: NoMenuLayoutProps) {
  return <main className={styles.publicMain}>{children}</main>;
}
