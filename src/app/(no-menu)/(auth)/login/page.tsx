import {isLoggedIn} from "@/app/(no-menu)/(auth)/actions";
import {redirect} from "next/navigation";
import {Button, Card, CardBody} from "react-bootstrap";
import {LoginForm} from "./LoginForm";
import styles from "./page.module.scss";
import CenterLogoContent from "@/ui/CenterLogoContent";

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
    <CenterLogoContent>
      <Card className={styles.formCard}>
        <CardBody>
          <LoginForm />
          <Button variant="link" type="button" className="w-100">
            Forgot Password?
          </Button>
        </CardBody>
      </Card>
    </CenterLogoContent>
  );
}
