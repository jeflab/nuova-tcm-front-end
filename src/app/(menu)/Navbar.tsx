import {HelpLink} from "@/app/(menu)/HelpLink";
import {LoginButton} from "@/app/(menu)/LoginButton";
import {getAccount, isLoggedIn} from "@/app/(no-menu)/(auth)/actions";
import {cns} from "@/helpers/cns";
import {Broker} from "@/models/entities/broker";
import {AppContainer} from "@/ui/AppContainer";
import {getTheme} from "@/ui/Theme/actions";
import {ThemeButton} from "@/ui/Theme/ThemeButton";
import Image from "next/image";
import Link from "next/link";
import {
  Nav,
  Navbar as BSNavbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  NavLink,
} from "react-bootstrap";
import styles from "./Navbar.module.scss";
import {LogoutButton} from "./LogoutButton";
import {Permission} from "@/models/account";

export async function Navbar() {
  const serverTheme = await getTheme();
  const loggedIn = await isLoggedIn();

  // get page url in server components

  let permissions = [] as Permission[];
  let broker: Broker | undefined | null;
  let fiscalCode: string | undefined;

  if (loggedIn) {
    const account = await getAccount();

    if (account?.status === "success") {
      permissions = account.permissions;
      broker = account.broker;
      fiscalCode = account.user.fiscalCode;
    }
  }

  return (
    <BSNavbar
      expand="md"
      className={cns(styles.navbar, "bg-body-tertiary")}
      fixed="top"
      collapseOnSelect
    >
      <AppContainer>
        <NavbarBrand href="/" className={styles.navbarBrandLink}>
          {broker?.information.logo && (
            <Image
              src={broker?.information.logo.url}
              height={broker?.information.logo.height}
              width={broker?.information.logo.width}
              alt={`logo ${broker?.name ?? "Smart Broker Space"}`}
              className="d-inline-block align-top"
            />
          )}{" "}
          <span className={styles.navbarBrandText}>
            {broker?.name ?? "Smart Broker Space"}
          </span>
        </NavbarBrand>
        <NavbarToggle
          className="d-print-none"
          aria-controls="basic-navbar-nav"
        />
        <NavbarCollapse className="d-print-none" id="basic-navbar-nav">
          <Nav className={cns("ms-auto", styles.navbarNav)}>
            {loggedIn ? (
              <>
                {permissions?.some(
                  (permission) => permission.name === "create-lip",
                ) && (
                  <NavLink as={Link} href="/quoter">
                    Preventivatore
                  </NavLink>
                )}
                {permissions.some(
                  (permission) => permission.name === "create-lip",
                ) && (
                  <NavLink as={Link} href="/lips">
                    Elenco Contraenti
                  </NavLink>
                )}
                {permissions.some(
                  (permission) => permission.name === "contractor-read-lip",
                ) && (
                  <NavLink as={Link} href="/contractorLips">
                    Le tue polizze
                  </NavLink>
                )}
                {permissions.some(
                  (permission) => permission.name === "create-lip",
                ) && (
                  <HelpLink
                    className="nav-link"
                    fiscalCode={fiscalCode}
                    label="Assistenza"
                  />
                )}
                <NavLink as={Link} href="/profile">
                  Il tuo profilo
                </NavLink>
                <LogoutButton>Esci</LogoutButton>
              </>
            ) : (
              <LoginButton>Accedi</LoginButton>
            )}
            <ThemeButton defaultTheme={serverTheme} />
          </Nav>
        </NavbarCollapse>
      </AppContainer>
    </BSNavbar>
  );
}
