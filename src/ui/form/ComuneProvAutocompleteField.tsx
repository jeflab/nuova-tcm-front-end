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
import {useContext, useState} from "react";
import {AsyncTypeahead, Highlighter} from "react-bootstrap-typeahead";
import FormContext from "react-bootstrap/FormContext";
import {useController, useFormContext} from "react-hook-form";
import invariant from "tiny-invariant";
import "react-bootstrap-typeahead/css/Typeahead.css";
import "react-bootstrap-typeahead/css/Typeahead.bs5.css";
import styles from "./ComuneProvAutocompleteField.module.scss";

interface ComuneProvAutocompleteFiledProps {
  disabled?: boolean;
  name?: string;
  validationStyle?: boolean;
}

export function ComuneProvAutocompleteField({
  disabled,
  name,
  validationStyle = true,
}: ComuneProvAutocompleteFiledProps) {
  const [cities, setCities] = useState<City[]>(getCities);
  const {
    setValue,
    formState: {errors},
  } = useFormContext();
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  const {
    field: {onBlur, onChange, value, ...altri},
    fieldState,
    formState,
  } = useController({name: `${controlName}.city`});

  const {isInvalid, isValid} = useValidationState(controlName);

  console.log("metodi", {
    field: {onBlur, onChange, ...altri},
    fieldState,
    formState,
  });

  const onSearch = (query: string) => {
    setCities(getCities(query));
  };

  return (
    <div className="hstack gap-3">
      <AsyncTypeahead
        id={controlName}
        className={styles.cityInputWrapper}
        disabled={disabled}
        options={cities}
        placeholder="Luogo di nascita"
        emptyLabel={
          <span className="dropdown-item-text text-center">
            <FontAwesomeIcon icon={faExclamationTriangle} /> Nessun comune
            trovato per &quot;{value}&quot;
          </span>
        }
        promptText={
          <span className="dropdown-item-text text-center">
            <FontAwesomeIcon icon={faInfoCircle} /> Scrivi per cercare la città
          </span>
        }
        searchText={
          <span className="dropdown-item-text text-center">
            <FontAwesomeIcon icon={faSpinner} className="fa-spin" /> Ricerca
            città in corso...
          </span>
        }
        isLoading
        highlightOnlyResult
        filterBy={(option, props) => {
          const searchStr = props.text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[‘’]/g, "'");
          const cityName = (option as City).city.toLowerCase();

          return cityName.includes(searchStr) || cityName === "estero";
        }}
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
          onChange(upperCaseWordsNormalizer((selected[0] as City)?.city) ?? "");
          onBlur();
        }}
        onInputChange={() => {
          setValue?.(`${controlName}.province`, "");
        }}
        inputProps={{
          name: `${controlName}.city`,
          autoComplete: "chrome-off",
          className: styles.cityInput,
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
        onSearch={(text) => {
          onSearch(text);
        }}
      />
      <InputField
        type="text"
        name={`${controlName}.province`}
        readOnly
        maxLength={2}
        className={styles.provinceInput}
      />
    </div>
  );
}
