import {cns} from "@/helpers/cns";
import {Nullable} from "@/helpers/TypesHelper";
import {citizenshipsOptions} from "@/services/queries/citizenshipsOptions";
import {faArrowsRotate, faSpinner} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useQuery} from "@tanstack/react-query";
import {Button} from "react-bootstrap";

interface NationalityAutocompleteProps {
  alpha2: Nullable<string>;
}

export function CitizenshipText({alpha2}: NationalityAutocompleteProps) {
  const {
    data: citizenships,
    isPending: isCitizenshipsPending,
    isRefetching: isCitizenshipsRefetching,
    error: citizenshipsError,
    isError: isCitizenshipsError,
    refetch: refetchCitizenships,
  } = useQuery(citizenshipsOptions());

  if (isCitizenshipsError) {
    return (
      <span className="text-danger">
        {citizenshipsError.message}
        <Button
          size="sm"
          variant="link"
          onClick={() => refetchCitizenships()}
          title="Riprova"
        >
          <FontAwesomeIcon
            icon={faArrowsRotate}
            className={cns(isCitizenshipsRefetching && "fa-spin")}
          ></FontAwesomeIcon>
        </Button>
      </span>
    );
  }

  if (isCitizenshipsPending) {
    return (
      <span>
        <FontAwesomeIcon icon={faSpinner} className="fa-spin me-1" />
        Caricamento...
      </span>
    );
  }

  const transform = {
    input(alpha2: Nullable<string>) {
      if (!alpha2) {
        return "";
      }
      return (
        citizenships.find((option) => option.alpha2 === alpha2)?.citizenship ??
        alpha2
      );
    },
    output(citizenship: Nullable<string>) {
      if (!citizenship) {
        return "";
      }
      return (
        citizenships.find((option) => option.citizenship === citizenship)
          ?.alpha2 ?? citizenship
      );
    },
  };

  return <span>{transform.input(alpha2)}</span>;
}
