import CenterLogoContent from "@/ui/CenterLogoContent";
import ForgotPassword from "./ForgotPassword";

const containerStyle = {"--content-width": "400px"};

export default async function ForgotPasswordPage() {
  return (
    <CenterLogoContent style={containerStyle}>
      <ForgotPassword />
    </CenterLogoContent>
  );
}
