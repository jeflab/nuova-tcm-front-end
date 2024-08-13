import {cns} from "@/helpers/cns";
import {faArrowRotateBack, faSpinner} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/navigation";
import {useTransition} from "react";
import {Button} from "react-bootstrap";

interface RetryOnErrorButtonProps {
  className?: string;
  onReset: () => void;
}

export function RetryOnErrorButton({
  className,
  onReset,
}: RetryOnErrorButtonProps) {
  const [isRetrying, startTransition] = useTransition();
  const router = useRouter();

  const refresh = () => {
    startTransition(() => {
      router.refresh();
      onReset();
    });
  };

  return (
    <Button
      onClick={refresh}
      type="button"
      className={className}
      disabled={isRetrying}
    >
      <FontAwesomeIcon
        icon={isRetrying ? faSpinner : faArrowRotateBack}
        className={cns("me-2", isRetrying && "fa-spin")}
      />
      Riprova
    </Button>
  );
}
