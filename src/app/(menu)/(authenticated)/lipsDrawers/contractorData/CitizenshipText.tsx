import {Nullable} from "@/helpers/TypesHelper";
import {citizenshipsOptions} from "@/services/queries/citizenshipsOptions";
import {useQuery} from "@tanstack/react-query";

interface NationalityAutocompleteProps {
  alpha2: Nullable<string>;
}

export function CitizenshipText({alpha2}: NationalityAutocompleteProps) {
  const {
    data: citizenships,
    isPending: isCitizenshipsPending,
    error: citizenshipsError,
    isError: isCitizenshipsError,
  } = useQuery(citizenshipsOptions());

  if (isCitizenshipsError) {
    return (
      <span className="alert alert-danger">{citizenshipsError.message}</span>
    );
  }

  if (isCitizenshipsPending) {
    return <span>Caricamento...</span>;
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
