import {SetPasswordForm} from "@/app/(no-menu)/(auth)/resetPassword/SetPasswordForm";
import {ButtonLink} from "@/ui/ButtonLink";
import CenterLogoContent from "@/ui/CenterLogoContent";
import {Alert, Card} from "react-bootstrap";

const containerStyle = {"--content-width": "400px"};

interface ResetPasswordParams {
  searchParams: {token: string};
}

export default function ResetPassword({searchParams}: ResetPasswordParams) {
  return (
    <CenterLogoContent style={containerStyle}>
      <Card body className="w-100">
        <Alert variant="info">
          Inserisci il codice che hai ricevuto via mail e scegli una password
          per attivare il tuo account
        </Alert>
        <SetPasswordForm
          token={searchParams.token}
          submitButtonLabel="Attiva il tuo account"
        />
        <ButtonLink variant="link" href="/login" className="w-100">
          Login
        </ButtonLink>
      </Card>
    </CenterLogoContent>
  );
}
