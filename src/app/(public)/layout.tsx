import {ReactNode} from "react";
import styles from "./layout.module.scss";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({children}: RootLayoutProps) {
  return <main className={styles.publicMain}>{children}</main>;
}
