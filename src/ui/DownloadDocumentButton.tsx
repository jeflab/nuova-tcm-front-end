import {DownloadDocumentsSearchParams} from "@/app/download-doc/schema";
import {cns} from "@/helpers/cns";
import {createDocumentUrl} from "@/helpers/createResourcesUrl";
import {normalizeError} from "@/helpers/errors";
import {ButtonLink} from "@/ui/ButtonLink"; // Assicurati che il path sia corretto
import {WithChildren} from "@/ui/types";
import {
  faCircleExclamation,
  faDownload,
  faSpinner,
} from "@fortawesome/pro-duotone-svg-icons";
import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import React, {useState} from "react";
import {ButtonProps} from "react-bootstrap";

export type DownloadDocumentButtonProps = {
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
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const url = createDocumentUrl(createDocumentUrlParams);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setErrorMessage(undefined);
    setLoading(true);

    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = ""; // opzionale: puoi impostare il nome file
      document.body.appendChild(link);

      link.click();
      link.remove();
    } catch (err) {
      setErrorMessage(
        normalizeError(err).message ||
          "Errore durante il download del documento",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ButtonLink
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cns(loading && "disabled", className)}
      size={size}
      onClick={handleClick}
      style={{pointerEvents: loading ? "none" : "auto"}}
    >
      {loading ? (
        <FontAwesomeIcon icon={faSpinner} className="fa-spin" />
      ) : errorMessage ? (
        <FontAwesomeIcon
          icon={faCircleExclamation}
          className="text-danger"
          title={errorMessage}
        />
      ) : (
        <FontAwesomeIcon icon={icon} />
      )}{" "}
      {children}
    </ButtonLink>
  );
}
