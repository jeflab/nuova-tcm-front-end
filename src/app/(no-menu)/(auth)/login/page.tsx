import {HelpLink} from "@/app/(menu)/HelpLink";
import {isLoggedIn} from "@/app/(no-menu)/(auth)/actions";
import {ButtonLink} from "@/ui/ButtonLink";
import {redirect} from "next/navigation";
import {Card, CardBody} from "react-bootstrap";
import {LoginForm} from "./LoginForm";
import styles from "./page.module.scss";
import CenterLogoContent from "@/ui/CenterLogoContent";
import * as Sentry from "@sentry/nextjs";

interface LoginPageProps {
  searchParams: Promise<{
    next?: string;
  }>;
}

export default async function LoginPage(props: LoginPageProps) {
  const searchParams = await props.searchParams;
  if (await isLoggedIn()) {
    Sentry.addBreadcrumb({
      message: "User is already logged in",
      category: "auth",
      data: {
        searchParams,
        redirectTo: searchParams.next ?? "/",
      },
    });

    if (searchParams.next) {
      redirect(searchParams.next);
    }

    redirect("/");
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
