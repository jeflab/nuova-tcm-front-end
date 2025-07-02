import {cns} from "@/helpers/cns";
import {ErrorCodes, errors} from "@/helpers/errors";
import {useValidationState} from "@/ui/form/hooks";
import {WithChildren} from "@/ui/types";
import {useContext} from "react";
import FormContext from "react-bootstrap/FormContext";
import Dropzone, {FileRejection} from "react-dropzone";
import {RegisterOptions, useController, useFormContext} from "react-hook-form";
import invariant from "tiny-invariant";
import styles from "./FileDropzoneField.module.scss";

const mbExponent = 20;
const mb = 2 ** mbExponent; // 1 MB
const maxSize = 8 * mb;

interface FileDropzoneFieldProps extends WithChildren {
  name?: string;
  preselectedImageUrl?: string;
  validation?: RegisterOptions;
}

export function FileDropzoneField({
  children,
  name,
  validation,
}: FileDropzoneFieldProps) {
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");

  const {setError} = useFormContext();
  const {
    field: {onBlur, onChange, value},
  } = useController({name: controlName, rules: validation});

  const {isInvalid, isValid} = useValidationState(controlName);

  const handleDrop = (accepted: File[], fileRejections: FileRejection[]) => {
    if (accepted.length === 0 && fileRejections.length > 1) {
      setError(controlName, {
        type: "custom",
        message: errors[ErrorCodes.ID_FILE_MULTIPLE].message,
      });
    } else if (accepted.length === 0 && fileRejections.length === 1) {
      setError(controlName, {
        type: "custom",
        message: errors[ErrorCodes.ID_FILE_NOT_VALID].message,
      });
    } else if (accepted[0] && accepted[0].size > maxSize) {
      setError(controlName, {
        type: "custom",
        message: errors[ErrorCodes.ID_FILE_TOO_BIG].message,
      });
    } else if (accepted[0]) {
      const newFile = accepted[0];
      onChange(newFile);
      onBlur();
    }
  };

  return (
    <Dropzone
      accept={{
        "application/pdf": [".pdf"],
      }}
      multiple={false}
      minSize={0}
      maxSize={maxSize}
      onDrop={handleDrop}
    >
      {({
        getRootProps,
        getInputProps,
        isDragAccept,
        isDragActive,
        isDragReject,
      }) => {
        return (
          <div
            {...getRootProps()}
            className={cns(
              "p-3",
              styles.dropzoneField,
              isDragActive && styles.isDragActive,
              isDragReject && styles.isDragReject,
              isDragAccept && styles.isDragAccept,
              isValid && styles.isValid,
              isInvalid && styles.isInvalid,
            )}
          >
            <input {...getInputProps()} />
            {value && (
              <div className={styles.dropzoneAreaThumbnail}>
                File selezionato: {value.path.replace("./", "")}
              </div>
            )}
            <div
              className={cns(
                styles.dropzoneAreaPlaceholder,
                !!value && styles.hasThumbnail,
              )}
            >
              {children}
            </div>
          </div>
        );
      }}
    </Dropzone>
  );
}
