import {Navbar} from "@/app/(authenticated)/Navbar";
import {faCopyright} from "@fortawesome/pro-duotone-svg-icons/faCopyright";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ReactNode} from "react";
import {Container} from "react-bootstrap";
import styles from "./layout.module.scss";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({children}: RootLayoutProps) {
  return (
    <div className={styles.appWrapper}>
      <header className={styles.appHeader}>
        <Navbar />
      </header>
      <main className={styles.appMain}>{children}</main>
      <footer className={styles.appFooter}>
        <Container>
          <p>
            <FontAwesomeIcon icon={faCopyright} className="text-primary" /> 2021
            Nuova TCM
          </p>
        </Container>
      </footer>
    </div>
  );
}
