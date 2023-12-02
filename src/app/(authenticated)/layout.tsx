import {Navbar} from "@/app/(authenticated)/Navbar";
import {ReactNode} from "react";
import {Footer} from "./Footer";
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
        <Footer />
      </footer>
    </div>
  );
}
