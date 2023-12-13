import {FieldValues} from "react-hook-form";

export function objToFormData(obj: FieldValues) {
  const formData = new FormData();
  Object.entries(obj).forEach(([key, value]) => {
    if (value) {
      formData.append(key, value);
    }
  });
  return formData;
}
