import {useDrawerStore} from "@/app/(menu)/(authenticated)/lips/[id]/store";
import {cns} from "@/helpers/cns";
import {ErrorCodes, errors} from "@/helpers/errors";
import {useValidationState} from "@/ui/form/hooks";
import {WithChildren} from "@/ui/types";
import {useContext, useState} from "react";
import FormContext from "react-bootstrap/FormContext";
import Dropzone, {FileRejection} from "react-dropzone";
import {RegisterOptions, useController, useFormContext} from "react-hook-form";
import invariant from "tiny-invariant";
import styles from "./DropzoneField.module.scss";

const mbExponent = 20;
const mb = 2 ** mbExponent; // 1 MB
const maxSize = 16 * mb;

interface DropzoneFieldProps extends WithChildren {
  // renderContent: (dropzoneState: DropzoneState) => ReactElement;
  name?: string;
  validation?: RegisterOptions;
}

export function DropzoneField({
  children,
  name,
  validation,
}: DropzoneFieldProps) {
  const {controlId} = useContext(FormContext);
  const controlName = name || controlId;
  invariant(controlName, "name or controlId is required");
  const [thumbUrl, setThumbUrl] = useState<string>();

  const setPicture = useDrawerStore((state) => state.setPicture);

  const {setError} = useFormContext();
  const {
    field: {onBlur, onChange, value},
  } = useController({name: controlName, rules: validation});

  const {isInvalid, isValid} = useValidationState(controlName);

  const handleDrop = (accepted: File[], fileRejections: FileRejection[]) => {
    const newFile = accepted[0];

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
      // 16MB
      setError(controlName, {
        type: "custom",
        message: errors[ErrorCodes.ID_FILE_TOO_BIG].message,
      });
    } else {
      setPicture(controlName + "Url", URL.createObjectURL(newFile));
      setThumbUrl(URL.createObjectURL(newFile));
      onChange(newFile);
      onBlur();
    }
  };

  return (
    <Dropzone
      accept={{
        "image/*": [".jpg", ".jpeg", ".png", ".bmp"],
      }}
      multiple={false}
      minSize={0}
      maxSize={50000000}
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
              "ratio ratio-1x1",
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
              <div
                className={styles.dropzoneAreaThumbnail}
                style={{
                  backgroundImage: `url(${thumbUrl})`,
                }}
              />
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
