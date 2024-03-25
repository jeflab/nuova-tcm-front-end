"use client";

import {forgotPassword} from "@/app/(no-menu)/(auth)/actions";
import {cns} from "@/helpers/cns";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {emailNormalizer, upperCaseNormalizer} from "@/ui/form/normalizers";
import {SubmitButton} from "@/ui/form/SubmitButton";
import {email} from "@/ui/form/validators/email";
import {fiscalCodeValidator} from "@/ui/form/validators/fiscalCode";
import {IconStack} from "@/ui/IconStack";
import {faUnlock} from "@fortawesome/pro-duotone-svg-icons";
import {faRotateReverse} from "@fortawesome/pro-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, FormGroup, FormLabel} from "react-bootstrap";

const defaultValues = {
  fiscalCode: "",
  email: "",
};

export function ForgotPasswordForm() {
  const handleSubmit = async (data: typeof defaultValues) => {
    if (!data.fiscalCode && !data.email) {
      throw {
        root: {
          type: "server",
          message: "Compila almeno uno dei due campi",
        },
      };
    }

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

    if (forgotPasswordResponse.status === "failed") {
      throw {root: {type: "server", message: forgotPasswordResponse.message}};
    }
  };

  return (
    <Form
      onSubmit={handleSubmit}
      defaultValues={defaultValues}
      className="d-flex flex-column gap-3"
    >
      <Alert variant="info">
        Inserisci la tua email oppure il tuo codice fiscale. Ti invieremo un
        messaggio con le istruzioni per impostare una nuova password.
      </Alert>
      <FormGroup controlId="fiscalCode">
        <FormLabel>Codice Fiscale</FormLabel>
        <InputField
          type="text"
          placeholder="Codice Fiscale"
          validation={{
            validate: (value) =>
              !value ||
              fiscalCodeValidator(value) ||
              "Codice fiscale non valido",
          }}
          normalize={upperCaseNormalizer}
        />
        <FieldError />
      </FormGroup>
      <FormGroup controlId="email">
        <FormLabel>Email</FormLabel>
        <InputField
          type="email"
          placeholder="E-mail"
          validation={{
            validate: (value) => !value || email(value) || "Email non valida",
          }}
          normalize={emailNormalizer}
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
