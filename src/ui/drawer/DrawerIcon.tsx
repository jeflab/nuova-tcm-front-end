import {cns} from "@/helpers/cns";
import {DrawerState} from "@/ui/drawer/types";
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

interface DrawerIconProps extends Omit<FontAwesomeIconProps, "icon"> {
  className?: string;
  variant?: DrawerState["variant"];
}

export function DrawerIcon({
  className,
  variant,
  ...fontawesomeProps
}: DrawerIconProps) {
  if (variant === "danger") {
    return (
      <FontAwesomeIcon
        {...fontawesomeProps}
        icon={faCircleExclamation}
        className={cns("text-danger", className)}
      />
    );
  }

  if (variant === "success") {
    return (
      <FontAwesomeIcon
        {...fontawesomeProps}
        icon={faCheckCircle}
        className={cns("text-success", className)}
      />
    );
  }

  if (variant === "active") {
    return (
      <FontAwesomeIcon
        {...fontawesomeProps}
        icon={faCirclePlay}
        className={cns("text-primary", className)}
      />
    );
  }

  if (variant === "waiting") {
    return (
      <FontAwesomeIcon
        {...fontawesomeProps}
        icon={faCirclePause}
        className={cns("text-warning", className)}
      />
    );
  }

  if (variant === "loading") {
    return (
      <>
        <FontAwesomeIcon
          {...fontawesomeProps}
          icon={faCirclePause}
          className={cns("fa-fade", className)}
          style={{"--fa-animation-duration": "2s"}}
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
