import {LoginButton} from "@/app/(menu)/LoginButton";
import {getAccount, isLoggedIn} from "@/app/(no-menu)/(auth)/actions";
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
import styles from "./layout.module.scss";
import {LogoutButton} from "./LogoutButton";
import {Permission} from "@/models/account";

export async function Navbar() {
  const serverTheme = await getTheme();
  const loggedIn = await isLoggedIn();

  let permissions = [] as Permission[];
  let broker: Broker | undefined | null;

  if (loggedIn) {
    const account = await getAccount();

    if (account.status === "success") {
      permissions = account.permissions;
      broker = account.broker;
    }
  }

  return (
    <BSNavbar
      expand="md"
      className="bg-body-tertiary"
      fixed="top"
      collapseOnSelect
    >
      <AppContainer>
        <NavbarBrand href="/">
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
        <NavbarToggle aria-controls="basic-navbar-nav" />
        <NavbarCollapse id="basic-navbar-nav">
          <Nav className="ms-auto">
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
