import {HelpLink} from "@/app/(menu)/HelpLink";
import {ButtonLink} from "@/ui/ButtonLink";
import CenterLogoContent from "@/ui/CenterLogoContent";
import {Card, CardBody} from "react-bootstrap";
import {LoginForm} from "./LoginForm";
import styles from "./page.module.scss";

interface LoginPageProps {
  searchParams: Promise<{
    next?: string;
  }>;
}

export default async function LoginPage(props: LoginPageProps) {
  const searchParamsJson = JSON.stringify(await props.searchParams);

  return (
    <CenterLogoContent>
      <Card className={styles.formCard}>
        <CardBody>
          <LoginForm searchParamsJson={searchParamsJson} />
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
