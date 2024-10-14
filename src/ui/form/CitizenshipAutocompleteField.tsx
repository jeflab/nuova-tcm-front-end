import {cns} from "@/helpers/cns";
import {citizenshipsOptions} from "@/services/queries/citizenshipsOptions";
import {InputField} from "@/ui/form/InputField";
import {upperCaseWordsNormalizer} from "@/ui/form/normalizers";
import {
  faArrowsRotate,
  faExclamationTriangle,
  faSpinner,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useQuery} from "@tanstack/react-query";
import {useContext, useState} from "react";
import {Highlighter, Typeahead} from "react-bootstrap-typeahead";
import FormContext from "react-bootstrap/esm/FormContext";
import {RegisterOptions, useController} from "react-hook-form";
import invariant from "tiny-invariant";
import {useValidationState} from "./hooks";
import styles from "./NationalityAutocompleteField.module.scss";
import {Button} from "react-bootstrap";

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
  alpha2: string;
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
  const [query, setQuery] = useState("");
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  const {
    field: {onBlur, onChange, value, ref},
  } = useController({name: controlName, rules: validation});

  const {isInvalid, isValid} = useValidationState(controlName);

  const {
    data: citizenships,
    isPending: isCitizenshipsPending,
    error: citizenshipsError,
    isError: isCitizenshipsError,
    refetch: refetchCitizenships,
    isRefetching: isCitizenshipsRefetching,
  } = useQuery(citizenshipsOptions());

  if (isCitizenshipsError) {
    return (
      <div className="alert alert-danger mb-0">
        {citizenshipsError.message}
        <Button
          size="sm"
          variant="link"
          onClick={() => refetchCitizenships()}
          title="Riprova"
          className="alert-link"
        >
          <FontAwesomeIcon
            icon={faArrowsRotate}
            className={cns(isCitizenshipsRefetching && "fa-spin")}
          ></FontAwesomeIcon>
        </Button>
      </div>
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
    input(alpha2: string) {
      if (!alpha2) {
        return "";
      }
      return (
        citizenships.find((option) => option.alpha2 === alpha2)?.citizenship ??
        alpha2
      );
    },
    output(citizenship: string) {
      if (!citizenship) {
        return "";
      }
      return (
        citizenships.find((option) => option.citizenship === citizenship)
          ?.alpha2 ?? citizenship
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
          isLoading={isCitizenshipsPending}
          isValid={validationStyle && isValid}
          labelKey={(option) => (option as CitizenshipOption)?.citizenship}
          onBlur={onBlur}
          onChange={(selected) => {
            onChange(
              transform.output(
                (selected[0] as CitizenshipOption)?.citizenship ?? "",
              ),
            );
            onBlur();
          }}
          onInputChange={(text) => {
            setQuery(text);
          }}
          options={citizenships}
          placeholder={placeholder}
          ref={ref}
          renderMenuItemChildren={(option, {text}) => {
            return (
              <span>
                <Highlighter search={text}>
                  {upperCaseWordsNormalizer(
                    (option as CitizenshipOption)?.citizenship,
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
