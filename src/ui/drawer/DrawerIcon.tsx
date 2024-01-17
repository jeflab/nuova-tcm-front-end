import {cns} from "@/helpers/cns";
import {
  faCheckCircle,
  faCircle,
  faCircleExclamation,
  faCirclePause,
  faCirclePlay,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CSSProperties} from "react";

interface DrawerIconProps {
  className?: string;
  isActive?: boolean;
  isDanger?: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
}

export function DrawerIcon({
  className,
  isActive,
  isDanger,
  isLoading,
  isSuccess,
}: DrawerIconProps) {
  if (isDanger) {
    return (
      <FontAwesomeIcon
        icon={faCircleExclamation}
        className={cns("text-danger", className)}
      />
    );
  }

  if (isSuccess) {
    return (
      <FontAwesomeIcon
        icon={faCheckCircle}
        className={cns("text-success", className)}
      />
    );
  }

  if (isActive) {
    return (
      <FontAwesomeIcon
        icon={faCirclePlay}
        className={cns("text-primary", className)}
      />
    );
  }

  if (isLoading) {
    return (
      <>
        <FontAwesomeIcon
          icon={faCirclePause}
          className={cns("fa-fade", className)}
          style={{"--fa-animation-duration": "2s"} as CSSProperties}
        />
      </>
    );
  }

  return <FontAwesomeIcon icon={faCircle} className={className} />;
}
