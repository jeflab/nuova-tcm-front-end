import {listCaps} from "@/app/(public)/login/actions";
import Image from "next/image";
import {Button, Card, CardBody} from "react-bootstrap";
import {LoginForm} from "./LoginForm";
import styles from "./page.module.scss";
import logo from "@/images/logo.png";

export default async function LoginPage() {
  return (
    <>
      <Image src={logo} height={200} alt="logo" />
      <Card className={styles.formCard}>
        <CardBody>
          <LoginForm />
          <Button variant="link" type="button" className="w-100">
            Forgot Password?
          </Button>
          <select>
            <option value="0">Select</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
          </select>
        </CardBody>
      </Card>
    </>
  );
}
