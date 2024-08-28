import {cns} from "@/helpers/cns";
import {normalizeErrorMessage} from "@/helpers/errors";
import {InputField} from "@/ui/form/InputField";
import {upperCaseWordsNormalizer} from "@/ui/form/normalizers";
import {faExclamationTriangle} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useContext, useEffect, useState} from "react";
import {Highlighter, Typeahead} from "react-bootstrap-typeahead";
import FormContext from "react-bootstrap/esm/FormContext";
import {RegisterOptions, useController} from "react-hook-form";
import invariant from "tiny-invariant";
import {getCitizenships} from "./actions";
import {useValidationState} from "./hooks";
import styles from "./NationalityAutocompleteField.module.scss";

interface NationalityAutocompleteProps {
  disabled?: boolean;
  name?: string;
  placeholder?: string;
  plaintext?: boolean;
  readOnly?: boolean;
  validation?: RegisterOptions;
  validationStyle?: boolean;
}

interface CitizenshipOption {
  alpha3: string;
  citizenship: string;
}

export function CitizenshipAutocompleteField({
  disabled,
  name,
  placeholder,
  plaintext,
  readOnly,
  validation,
  validationStyle = true,
}: NationalityAutocompleteProps) {
  const [isLoadingNationalities, setIsLoadingNationalities] = useState(false);
  const [error, setError] = useState("");
  const [nationalities, setNationalities] = useState<CitizenshipOption[]>([]);
  const [query, setQuery] = useState("");
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  const {
    field: {onBlur, onChange, value, ref},
  } = useController({name: controlName, rules: validation});

  const {isInvalid, isValid} = useValidationState(controlName);

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
    return <div className="alert alert-danger">{error}</div>;
  }

  if (isLoadingNationalities) {
    return <div>Caricamento...</div>;
  }

  const transform = {
    input(alpha3: string) {
      if (!alpha3) {
        return "";
      }
      return (
        nationalities.find((option) => option.alpha3 === alpha3)?.citizenship ??
        alpha3
      );
    },
    output(citizenship: string) {
      if (!citizenship) {
        return "";
      }
      return (
        nationalities.find((option) => option.citizenship === citizenship)
          ?.alpha3 ?? citizenship
      );
    },
  };

  return (
    <div className="hstack gap-3">
      {readOnly ? (
        <InputField
          type="text"
          name={controlName}
          readOnly
          plaintext={plaintext}
        />
      ) : (
        <Typeahead
          className={styles.cityInputWrapper}
          defaultInputValue={transform.input(value)}
          disabled={disabled}
          emptyLabel={
            <span className="dropdown-item-text text-center">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-warning"
              />{" "}
              Nessuna nazionalità trovata per &quot;{query}&quot;
            </span>
          }
          flip
          highlightOnlyResult
          id={controlName}
          inputProps={{
            name: `${controlName}.city`,
            className: cns(
              styles.cityInput,
              plaintext && "form-control-plaintext",
            ),
            readOnly,
          }}
          isInvalid={validationStyle && isInvalid}
          isLoading={isLoadingNationalities}
          isValid={validationStyle && isValid}
          labelKey={(option) => (option as CitizenshipOption).citizenship}
          onBlur={onBlur}
          onChange={(selected) => {
            onChange(
              transform.output(
                (selected[0] as CitizenshipOption).citizenship ?? "",
              ),
            );
            onBlur();
          }}
          onInputChange={(text) => {
            setQuery(text);
          }}
          options={nationalities}
          placeholder={placeholder}
          ref={ref}
          renderMenuItemChildren={(option, {text}) => {
            return (
              <span>
                <Highlighter search={text}>
                  {upperCaseWordsNormalizer(
                    (option as CitizenshipOption).citizenship,
                  )}
                </Highlighter>
              </span>
            );
          }}
        />
      )}
    </div>
  );
}
