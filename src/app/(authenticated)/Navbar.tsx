import styles from "@/app/(authenticated)/layout.module.scss";
import {ThemeButton} from "@/ui/ThemeButton/ThemeButton";
import logo from "@/images/logo.png";
import {ThemeButtonIcon} from "@/ui/ThemeButton/ThemeButtonIcon";
import Image from "next/image";
import Link from "next/link";
import {
  Container,
  Nav,
  Navbar as BSNavbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarToggle,
  NavLink,
} from "react-bootstrap";

export function Navbar() {
  return (
    <BSNavbar expand="md" className="bg-body-tertiary" fixed="top">
      <Container>
        <NavbarBrand href="#home">
          <Image
            src={logo}
            height={30}
            alt="logo"
            className="d-inline-block align-top"
          />{" "}
          <span className={styles.navbarBrandText}>Nuova TCM</span>
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
            <ThemeButton>
              <ThemeButtonIcon />
            </ThemeButton>
          </Nav>
        </NavbarCollapse>
      </Container>
    </BSNavbar>
  );
}
