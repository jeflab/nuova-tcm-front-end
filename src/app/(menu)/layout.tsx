import {getAccountQuery} from "@/app/(menu)/(authenticated)/queries";
import {getQueryClient} from "@/ui/getQueryClient";
import {getTheme} from "@/ui/Theme/actions";
import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import {ReactNode} from "react";
import {Footer} from "./Footer";
import styles from "./layout.module.scss";
import {Navbar} from "./Navbar";

interface MenuLayoutProps {
  children: ReactNode;
}

export default async function MenuLayout({children}: MenuLayoutProps) {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(getAccountQuery());

  const serverTheme = await getTheme();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className={styles.appWrapper}>
        <header className={styles.appHeader}>
          <Navbar serverTheme={serverTheme} />
        </header>
        <main className={styles.appMain}>{children}</main>
        <footer className={styles.appFooter}>
          <Footer />
        </footer>
      </div>
    </HydrationBoundary>
  );
}
