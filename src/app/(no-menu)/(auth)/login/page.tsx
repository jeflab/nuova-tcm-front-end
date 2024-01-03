import {isLoggedIn} from "@/app/(no-menu)/(auth)/actions";
import logo from "@/images/logo.png";
import {DataTableParams} from "@/ui/table/helpers";
import {headers} from "next/headers";
import Image from "next/image";
import {redirect} from "next/navigation";
import {Button, Card, CardBody} from "react-bootstrap";
import {LoginForm} from "./LoginForm";
import styles from "./page.module.scss";

interface LoginPageProps {
  searchParams: {
    next?: string;
  };
}

export default async function LoginPage({searchParams}: LoginPageProps) {
  if (await isLoggedIn()) {
    if (searchParams.next) {
      return redirect(searchParams.next);
    }

    return redirect("/");
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
