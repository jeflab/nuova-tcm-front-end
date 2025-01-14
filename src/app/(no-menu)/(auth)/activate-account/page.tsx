import {ActivateAccount} from "@/app/(no-menu)/(auth)/activate-account/ActivateAccount";
import CenterLogoContent from "@/ui/CenterLogoContent";

const containerStyle = {"--content-width": "400px"};

interface ResetPasswordParams {
  searchParams: Promise<{token: string; email: string}>;
}

export default async function ResetPassword(props: ResetPasswordParams) {
  const searchParams = await props.searchParams;
  return (
    <CenterLogoContent style={containerStyle}>
      <ActivateAccount token={searchParams.token} email={searchParams.email} />
    </CenterLogoContent>
  );
}
