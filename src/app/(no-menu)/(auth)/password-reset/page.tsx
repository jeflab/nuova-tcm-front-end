import {SetPassword} from "@/app/(no-menu)/(auth)/password-reset/SetPassword";
import CenterLogoContent from "@/ui/CenterLogoContent";

const containerStyle = {"--content-width": "400px"};

interface ResetPasswordParams {
  searchParams: {token: string; email: string};
}

export default function ResetPassword({searchParams}: ResetPasswordParams) {
  return (
    <CenterLogoContent style={containerStyle}>
      <SetPassword token={searchParams.token} email={searchParams.email} />
    </CenterLogoContent>
  );
}
