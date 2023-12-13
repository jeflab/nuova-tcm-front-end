import styles from "@/app/(authenticated)/layout.module.scss";
import logo from "@/images/logo.png";
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

export function Navbar() {
  const serverTheme = getTheme();

  return (
    <BSNavbar expand="md" className="bg-body-tertiary" fixed="top">
      <AppContainer>
        <NavbarBrand href="/">
          <Image
            src={logo}
            height={30}
            alt="logo"
            className="d-inline-block align-top"
          />{" "}
          <span className={styles.navbarBrandText}>Piattaforma TCM</span>
        </NavbarBrand>
        <NavbarToggle aria-controls="basic-navbar-nav" />
        <NavbarCollapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink as={Link} href="#estimator">
              Preventivatore
            </NavLink>
            <NavLink as={Link} href="/lips">
              Polizze effettuate
            </NavLink>
            <NavLink as={Link} href="#home">
              Le tue polizze
            </NavLink>
            <NavLink as={Link} href="#profile">
              Il tuo profilo
            </NavLink>
            <NavLink as={Link} href="#logout">
              Esci
            </NavLink>
            <ThemeButton defaultTheme={serverTheme} />
          </Nav>
        </NavbarCollapse>
      </AppContainer>
    </BSNavbar>
  );
}
