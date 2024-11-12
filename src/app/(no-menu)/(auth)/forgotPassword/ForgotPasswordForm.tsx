"use client";

import {forgotPassword} from "@/app/(no-menu)/(auth)/actions";
import {cns} from "@/helpers/cns";
import {normalizeError} from "@/helpers/errors";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {upperCaseNormalizer} from "@/ui/form/normalizers";
import {SubmitButton} from "@/ui/form/SubmitButton";
import {fiscalCodeValidator} from "@/ui/form/validators/fiscalCode";
import {IconStack} from "@/ui/IconStack";
import {faUnlock} from "@fortawesome/pro-duotone-svg-icons";
import {faRotateReverse} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, FormGroup, FormLabel} from "react-bootstrap";

const defaultValues = {
  fiscalCode: "",
};

interface ForgotPasswordFormProps {
  onResetSuccess?: (email: string) => void;
}

export function ForgotPasswordForm({onResetSuccess}: ForgotPasswordFormProps) {
  const handleSubmit = async (data: typeof defaultValues) => {
    let forgotPasswordResponse: Awaited<ReturnType<typeof forgotPassword>>;

    try {
      forgotPasswordResponse = await forgotPassword(data);
    } catch (error) {
      console.error(error);
      throw {
        root: {
          type: "server",
          message: "Errore imprevisto, riprova più tardi.",
        },
      };
    }

    if (forgotPasswordResponse?.status !== "success") {
      throw {
        root: {
          type: "server",
          message: normalizeError(forgotPasswordResponse).message,
        },
      };
    }

    onResetSuccess?.(forgotPasswordResponse.email);
  };

  return (
    <Form
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      className="d-flex flex-column gap-3"
    >
      <FormGroup controlId="fiscalCode">
        <FormLabel>Codice Fiscale</FormLabel>
        <InputField
          type="text"
          placeholder="Codice Fiscale"
          validation={{
            required: "Inserisci il tuo codice fiscale.",
            validate: (value) =>
              fiscalCodeValidator(value) || "Codice fiscale non valido",
          }}
          normalize={upperCaseNormalizer}
        />
        <FieldError />
      </FormGroup>
      <FieldError name="root" as={Alert} variant="danger" className="mb-0" />
      <SubmitButton variant="primary" className="w-100">
        {(isLoggingIn) => (
          <>
            <IconStack className="me-2">
              <FontAwesomeIcon
                icon={faRotateReverse}
                className={cns(
                  "fa-stack-2x",
                  isLoggingIn && "fa-spin fa-spin-reverse",
                )}
              />
              <FontAwesomeIcon
                icon={faUnlock}
                transform="shrink-4"
                className="fa-stack-1x"
              />
            </IconStack>
            Recupera password
          </>
        )}
      </SubmitButton>
    </Form>
  );
}
