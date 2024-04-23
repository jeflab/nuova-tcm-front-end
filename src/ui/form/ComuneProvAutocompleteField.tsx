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
import {useCallback, useContext, useState} from "react";
import {AsyncTypeahead, Highlighter} from "react-bootstrap-typeahead";
import FormContext from "react-bootstrap/FormContext";
import {RegisterOptions, useController, useFormContext} from "react-hook-form";
import invariant from "tiny-invariant";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";
import styles from "./ComuneProvAutocompleteField.module.scss";

interface ComuneProvAutocompleteFiledProps {
  defaultValue?: {city?: string; province?: string};
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

export function ComuneProvAutocompleteField({
  defaultValue,
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
  const [isLoadingCities, setIsLoadingCities] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const {setValue} = useFormContext();
  const [query, setQuery] = useState("");
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  const {
    field: {onBlur, onChange},
  } = useController({name: `${controlName}.city`, rules: validation});

  const {isInvalid, isValid} = useValidationState(controlName);

  const handleSearch = useCallback(
    async (query: string) => {
      setIsLoadingCities(true);
      setCities(await getCities(query, {onlyExisting, onlyItalian}));
      setIsLoadingCities(false);
    },
    [onlyExisting],
  );

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
          disabled={disabled}
          options={cities}
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
          isLoading={isLoadingCities}
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
          inputProps={{
            name: `${controlName}.city`,
            className: cns(
              styles.cityInput,
              plaintext && "form-control-plaintext",
            ),
            readOnly,
          }}
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
          onSearch={handleSearch}
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
