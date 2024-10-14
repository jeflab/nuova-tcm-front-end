import {HelpLink} from "@/app/(menu)/HelpLink";
import {isLoggedIn} from "@/app/(no-menu)/(auth)/actions";
import {ButtonLink} from "@/ui/ButtonLink";
import {redirect} from "next/navigation";
import {Card, CardBody} from "react-bootstrap";
import {LoginForm} from "./LoginForm";
import styles from "./page.module.scss";
import CenterLogoContent from "@/ui/CenterLogoContent";
import {faLifeRing} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

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
          <ButtonLink variant="link" href="/forgotPassword" className="w-100">
            Forgot Password?
          </ButtonLink>
        </CardBody>
      </Card>
      <div className="text-center">
        <HelpLink fiscalCode="LOGIN" label="Hai bisogno di assistenza?" />
      </div>
    </CenterLogoContent>
  );
}
