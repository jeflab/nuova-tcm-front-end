import {cns} from "@/helpers/cns";
import {
  faCheckCircle,
  faCircle,
  faCirclePause,
  faCirclePlay,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CSSProperties} from "react";

interface DrawerIconProps {
  className?: string;
  isActive?: boolean;
  isComplete?: boolean;
  isLoading?: boolean;
}

export function DrawerIcon({
  className,
  isActive,
  isComplete,
  isLoading,
}: DrawerIconProps) {
  if (isComplete) {
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
