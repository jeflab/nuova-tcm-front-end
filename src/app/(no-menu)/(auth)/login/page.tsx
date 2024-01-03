import {isLoggedIn} from "@/app/(no-menu)/(auth)/actions";
import logo from "@/images/logo.png";
import Image from "next/image";
import {redirect} from "next/navigation";
import {Button, Card, CardBody} from "react-bootstrap";
import {LoginForm} from "./LoginForm";
import styles from "./page.module.scss";

export default async function LoginPage() {
  if (await isLoggedIn()) {
    console.log("logged in, redirect to /");
    redirect("/");
    return null;
  }

  return (
    <>
      <Image src={logo} height={200} alt="logo" />
      <Card className={styles.formCard}>
        <CardBody>
          <LoginForm />
          <Button variant="link" type="button" className="w-100">
            Forgot Password?
          </Button>
        </CardBody>
      </Card>
    </>
  );
}
