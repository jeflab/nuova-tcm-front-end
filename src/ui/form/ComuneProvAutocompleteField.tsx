import {cns} from "@/helpers/cns";
import {City, getCities} from "@/services/cities";
import {useValidationState} from "@/ui/form/hooks";
import {InputField} from "@/ui/form/InputField";
import {upperCaseWordsNormalizer} from "@/ui/form/normalizers";
import {
  faExclamationTriangle,
  faInfoCircle,
  faSpinner,
} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import useDebouncedState from "@restart/hooks/useDebouncedState";
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {useContext, useState} from "react";
import {AsyncTypeahead, Highlighter} from "react-bootstrap-typeahead";
import FormContext from "react-bootstrap/FormContext";
import {RegisterOptions, useController, useFormContext} from "react-hook-form";
import invariant from "tiny-invariant";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";
import styles from "./ComuneProvAutocompleteField.module.scss";

interface ComuneProvAutocompleteFiledProps {
  disabled?: boolean;
  name?: string;
  onlyExisting?: boolean;
  onlyItalian?: boolean;
  placeholder?: string;
  plaintext?: boolean;
  readOnly?: boolean;
  validation?: RegisterOptions;
  validationStyle?: boolean;
}

const oneDayInMs = 1000 * 60 * 60 * 24;

export function ComuneProvAutocompleteField({
  disabled,
  name,
  onlyExisting,
  onlyItalian,
  placeholder,
  plaintext,
  readOnly,
  validation,
  validationStyle = true,
}: ComuneProvAutocompleteFiledProps) {
  const {setValue} = useFormContext();
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  const {isInvalid, isValid} = useValidationState(controlName);

  const {
    field: {onBlur, onChange, value, ref},
    fieldState: {isTouched, isDirty},
  } = useController({name: `${controlName}.city`, rules: validation});
  const {
    field: {value: provinceValue},
  } = useController({name: `${controlName}.province`});

  const [query, setQuery] = useDebouncedState(value, 300);
  const [isEnabled, setIsEnabled] = useState(false);

  const {data: cities = [], isPending: isCitiesPending} = useQuery({
    queryKey: ["cities", query, onlyExisting, onlyItalian] as const,
    queryFn: ({queryKey: [_key, query, onlyExisting, onlyItalian]}) => {
      console.log("carico città da react query " + query);
      return getCities(query, {onlyExisting, onlyItalian});
    },
    staleTime: oneDayInMs,
    placeholderData: keepPreviousData,
    enabled: isEnabled,
  });

  console.log({isTouched, isDirty, isEnabled});

  return (
    <div className="hstack gap-3">
      {readOnly ? (
        <InputField
          type="text"
          name={`${controlName}.city`}
          readOnly
          plaintext={plaintext}
        />
      ) : (
        <AsyncTypeahead
          id={controlName}
          className={styles.cityInputWrapper}
          defaultInputValue={value}
          disabled={disabled}
          options={
            cities.length > 0
              ? cities
              : [{city: value, province: provinceValue}]
          }
          placeholder={placeholder}
          emptyLabel={
            <span className="dropdown-item-text text-center">
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="text-warning"
              />{" "}
              Nessun comune trovato per &quot;{query}&quot;
            </span>
          }
          promptText={
            <span className="dropdown-item-text text-center">
              <FontAwesomeIcon icon={faInfoCircle} /> Scrivi per cercare la
              città
            </span>
          }
          minLength={2}
          searchText={
            <span className="dropdown-item-text text-center">
              <FontAwesomeIcon icon={faSpinner} className="fa-spin" /> Ricerca
              città in corso...
            </span>
          }
          isLoading={isCitiesPending}
          highlightOnlyResult
          onBlur={onBlur}
          onChange={(selected) => {
            setValue?.(
              `${controlName}.province`,
              (selected[0] as City)?.province,
              {
                shouldValidate: true,
                shouldDirty: true,
              },
            );
            onChange(
              upperCaseWordsNormalizer((selected[0] as City)?.city) ?? "",
            );
            onBlur();
          }}
          onInputChange={(text) => {
            setQuery(text);
            setValue?.(`${controlName}.province`, "");
          }}
          onFocus={() => {
            setIsEnabled(true);
          }}
          inputProps={{
            name: `${controlName}.city`,
            className: cns(
              styles.cityInput,
              plaintext && "form-control-plaintext",
            ),
            readOnly,
          }}
          ref={ref}
          isInvalid={validationStyle && isInvalid}
          isValid={validationStyle && isValid}
          renderMenuItemChildren={(option, {text}) => {
            return (
              <span>
                <Highlighter search={text}>
                  {upperCaseWordsNormalizer((option as City).city)}
                </Highlighter>{" "}
                ({(option as City).province})
              </span>
            );
          }}
          labelKey={(option: unknown) =>
            upperCaseWordsNormalizer((option as City).city)
          }
          flip
          onSearch={(text) => {
            setQuery(text);
          }}
          useCache={false}
        />
      )}
      <InputField
        className={styles.provinceInput}
        maxLength={2}
        name={`${controlName}.province`}
        plaintext={plaintext}
        readOnly
        type="text"
      />
    </div>
  );
}
