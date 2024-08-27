import {cns} from "@/helpers/cns";
import {getNationalities} from "@/services/nationalities";
import {InputField} from "@/ui/form/InputField";
import {upperCaseWordsNormalizer} from "@/ui/form/normalizers";
import {faExclamationTriangle} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useContext, useEffect, useState} from "react";
import {Highlighter, Typeahead} from "react-bootstrap-typeahead";
import FormContext from "react-bootstrap/esm/FormContext";
import {RegisterOptions, useController} from "react-hook-form";
import invariant from "tiny-invariant";
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

export function NationalityAutocompleteField({
  disabled,
  name,
  placeholder,
  plaintext,
  readOnly,
  validation,
  validationStyle = true,
}: NationalityAutocompleteProps) {
  const [isLoadingNationalities, setIsLoadingNationalities] = useState(false);
  const [nationalities, setNationalities] = useState<string[]>([]);
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
      setNationalities(await getNationalities());
      setIsLoadingNationalities(false);
    };

    void getOptions();
  }, []);

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
          defaultInputValue={value}
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
          onBlur={onBlur}
          onChange={(selected) => {
            onChange(upperCaseWordsNormalizer((selected[0] as string) ?? ""));
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
                  {upperCaseWordsNormalizer(option as string)}
                </Highlighter>
              </span>
            );
          }}
        />
      )}
    </div>
  );
}
