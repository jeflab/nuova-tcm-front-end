import {ForgotPasswordForm} from "@/app/(no-menu)/(auth)/forgotPassword/ForgotPasswordForm";
import styles from "@/app/(no-menu)/(auth)/login/page.module.scss";
import {ButtonLink} from "@/ui/ButtonLink";
import CenterLogoContent from "@/ui/CenterLogoContent";
import {Card} from "react-bootstrap";

const containerStyle = {"--content-width": "400px"};

export default async function ForgotPasswordPage() {
  return (
    <CenterLogoContent style={containerStyle}>
      <Card body className="w-100">
        <ForgotPasswordForm />
        <ButtonLink variant="link" href="/login" className="w-100">
          Login
        </ButtonLink>
      </Card>
    </CenterLogoContent>
  );
}
