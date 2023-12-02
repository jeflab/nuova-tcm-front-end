import {WithChildren} from "@/ui/types";
import {Container} from "react-bootstrap";

interface AppContainerProps extends WithChildren {
  className?: string;
}
export function AppContainer({children, className}: AppContainerProps) {
  return (
    <Container fluid="lg" className={className}>
      {children}
    </Container>
  );
}
