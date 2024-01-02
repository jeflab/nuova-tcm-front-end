import {Navbar} from "@/app/(authenticated)/Navbar";
import {checkAuth} from "@/app/(public)/(auth)/actions";
import {ReactNode} from "react";
import {Footer} from "./Footer";
import styles from "./layout.module.scss";

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({children}: RootLayoutProps) {
  await checkAuth();

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
