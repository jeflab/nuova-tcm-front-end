import {cns} from "@/helpers/cns";
import {DrawerState} from "@/ui/drawer/const";
import {
  faCheckCircle,
  faCircle,
  faCircleExclamation,
  faCirclePause,
  faCirclePlay,
} from "@fortawesome/pro-duotone-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import {CSSProperties} from "react";

interface DrawerIconProps extends Omit<FontAwesomeIconProps, "icon"> {
  className?: string;
  state?: DrawerState;
}

export function DrawerIcon({
  className,
  state,
  ...fontawesomeProps
}: DrawerIconProps) {
  if (state === "danger") {
    return (
      <FontAwesomeIcon
        {...fontawesomeProps}
        icon={faCircleExclamation}
        className={cns("text-danger", className)}
      />
    );
  }

  if (state === "success") {
    return (
      <FontAwesomeIcon
        {...fontawesomeProps}
        icon={faCheckCircle}
        className={cns("text-success", className)}
      />
    );
  }

  if (state === "active") {
    return (
      <FontAwesomeIcon
        {...fontawesomeProps}
        icon={faCirclePlay}
        className={cns("text-primary", className)}
      />
    );
  }

  if (state === "waiting") {
    return (
      <FontAwesomeIcon
        {...fontawesomeProps}
        icon={faCirclePause}
        className={cns("text-warning", className)}
      />
    );
  }

  if (state === "loading") {
    return (
      <>
        <FontAwesomeIcon
          {...fontawesomeProps}
          icon={faCirclePause}
          className={cns("fa-fade", className)}
          style={{"--fa-animation-duration": "2s"} as CSSProperties}
        />
      </>
    );
  }

  return (
    <FontAwesomeIcon
      {...fontawesomeProps}
      icon={faCircle}
      className={className}
    />
  );
}
