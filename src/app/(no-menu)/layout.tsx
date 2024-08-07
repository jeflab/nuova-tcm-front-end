import {getVersion} from "@/helpers/release";
import {ReactNode} from "react";
import styles from "./layout.module.scss";

interface NoMenuLayoutProps {
  children: ReactNode;
}

export default function NoMenuLayout({children}: NoMenuLayoutProps) {
  return (
    <main className={styles.publicMain}>
      {children}
      <div className="ms-auto pb-2 px-3">
        <small className="text-muted">Versione {getVersion()}</small>
      </div>
    </main>
  );
}
