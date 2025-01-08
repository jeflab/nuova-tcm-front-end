import {DownloadDocumentsSearchParams} from "@/app/download-doc/schema";
import {createDocumentUrl} from "@/helpers/createResourcesUrl";
import {ButtonLink} from "@/ui/ButtonLink";
import {WithChildren} from "@/ui/types";
import {faDownload} from "@fortawesome/pro-duotone-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import {ButtonProps} from "react-bootstrap";

type DownloadDocumentButtonProps = {
  size?: ButtonProps["size"];
  className?: string;
  icon?: FontAwesomeIconProps["icon"];
} & WithChildren &
  DownloadDocumentsSearchParams;

export function DownloadDocumentButton({
  children,
  className,
  icon = faDownload,
  size,
  ...createDocumentUrlParams
}: DownloadDocumentButtonProps) {
  return (
    <ButtonLink
      className={className}
      href={createDocumentUrl(createDocumentUrlParams)}
      download
      target="_blank"
      size={size}
      prefetch={false}
    >
      <FontAwesomeIcon icon={icon} /> {children}
    </ButtonLink>
  );
}
