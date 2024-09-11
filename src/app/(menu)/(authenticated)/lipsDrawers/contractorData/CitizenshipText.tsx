import {normalizeErrorMessage} from "@/helpers/errors";
import {Nullable} from "@/helpers/TypesHelper";
import {
  getCitizenships,
  getCitizenshipsQuery,
} from "@/services/actions/citizenships";
import {Debug} from "@/ui/Debug";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";

interface NationalityAutocompleteProps {
  alpha2: Nullable<string>;
}

interface CitizenshipOption {
  alpha2: string;
  citizenship: string;
}

export function CitizenshipText({alpha2}: NationalityAutocompleteProps) {
  const [isLoadingNationalities, setIsLoadingNationalities] = useState(false);
  const [error, setError] = useState("");
  const [nationalities, setNationalities] = useState<CitizenshipOption[]>([]);

  const citizenships = useQuery({
    queryKey: ["citizenships"],
    queryFn: () => getCitizenshipsQuery(),
  });
  console.log("citizenships", citizenships);

  useEffect(() => {
    const getOptions = async () => {
      setIsLoadingNationalities(true);
      try {
        const citizenships = await getCitizenships();
        if (citizenships?.status !== "success") {
          setError("Impossibile recuperare l'elenco nazionalità");
          return;
        }

        setNationalities(citizenships.citizenships);
      } catch (error) {
        setError(normalizeErrorMessage(error));
      } finally {
        setIsLoadingNationalities(false);
      }
    };

    void getOptions();
  }, []);

  if (error) {
    return <span className="alert alert-danger">{error}</span>;
  }

  if (isLoadingNationalities) {
    return <span>Caricamento...</span>;
  }

  const transform = {
    input(alpha2: Nullable<string>) {
      if (!alpha2) {
        return "";
      }
      return (
        nationalities.find((option) => option.alpha2 === alpha2)?.citizenship ??
        alpha2
      );
    },
    output(citizenship: Nullable<string>) {
      if (!citizenship) {
        return "";
      }
      return (
        nationalities.find((option) => option.citizenship === citizenship)
          ?.alpha2 ?? citizenship
      );
    },
  };

  return (
    <>
      <Debug>{citizenships}</Debug>
      <span>{transform.input(alpha2)}</span>
    </>
  );
}
