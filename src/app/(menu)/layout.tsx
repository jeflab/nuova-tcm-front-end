import {ReactNode} from "react";
import {Footer} from "./Footer";
import styles from "./layout.module.scss";
import {Navbar} from "./Navbar";

interface MenuLayoutProps {
  children: ReactNode;
}

export default async function MenuLayout({children}: MenuLayoutProps) {
  return (
    <div className={styles.appWrapper}>
      <header className={styles.appHeader}>
        <Navbar />
      </header>
      <main className={styles.appMain}>{children}</main>
      <footer className={styles.appFooter}>
        <Footer />
      </footer>
    </div>
  );
}
