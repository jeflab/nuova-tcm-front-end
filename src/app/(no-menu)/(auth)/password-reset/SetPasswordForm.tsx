"use client";

import {setPassword} from "@/app/(no-menu)/(auth)/actions";
import {cns} from "@/helpers/cns";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {HelpText} from "@/ui/form/HelpText";
import {InputField} from "@/ui/form/InputField";
import {emailNormalizer} from "@/ui/form/normalizers";
import {SubmitButton} from "@/ui/form/SubmitButton";
import {emailValidator} from "@/ui/form/validators/email";
import {password} from "@/ui/form/validators/password";
import {faKey, faSpinner} from "@fortawesome/pro-duotone-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Alert, FormGroup, FormLabel} from "react-bootstrap";

interface SetPasswordParams {
  email: string;
  onPasswordSet?: () => void;
  submitButtonLabel: string;
  token?: string;
}

export function SetPasswordForm({
  email,
  onPasswordSet,
  submitButtonLabel,
  token,
}: SetPasswordParams) {
  return (
    <Form
      onSubmit={async (values) => {
        if (values.password !== values.repeatPassword) {
          throw {
            repeatPassword: {
              type: "custom",
              message: "Le password non corrispondono",
            },
          };
        }

        let setPasswordResponse: Awaited<ReturnType<typeof setPassword>>;

        try {
          setPasswordResponse = await setPassword(values);
        } catch (error) {
          console.error(error);
          throw {
            root: {
              type: "server",
              message: "Errore imprevisto, riprova più tardi.",
            },
          };
        }

        if (setPasswordResponse.status !== "success") {
          throw {root: {type: "server", message: setPasswordResponse.message}};
        }

        onPasswordSet?.();
      }}
      defaultValues={{
        email,
        token: token ?? "",
        password: "",
        repeatPassword: "",
      }}
      className="d-flex flex-column gap-3"
    >
      <FormGroup controlId="token">
        <FormLabel>Token segreto</FormLabel>
        <InputField
          type="text"
          placeholder="Token segreto"
          validation={{
            required: "Inserisci il token segreto che ti è arrivato per email.",
          }}
        />
        <FieldError />
      </FormGroup>
      <FormGroup controlId="email">
        <FormLabel>Email</FormLabel>
        <FieldError />
        <InputField
          type="email"
          placeholder="Email"
          validation={{
            validate: {
              required: (value) => {
                if (!value) {
                  return "Inserisci l'email";
                }
              },
              pattern: (value) => {
                if (!emailValidator(value)) {
                  return "L'email inserita non è valida";
                }
              },
            },
          }}
          normalize={emailNormalizer}
        />
      </FormGroup>
      <FormGroup controlId="password">
        <FormLabel>Nuova password</FormLabel>
        <InputField
          type="password"
          name="password"
          placeholder="Nuova password"
          validation={{
            validate: {
              required: (value) => {
                if (!value) {
                  return "Inserisci la tua nuova password";
                }
              },
              pattern: (value) => {
                if (value && !password(value)) {
                  return "La password deve non rispetta i requisiti minimi di sicurezza";
                }
              },
            },
          }}
        />
        <HelpText>
          La password deve contenere almeno 12 caratteri, di cui almeno una
          lettera maiuscola, una lettera minuscola, un numero e un carattere
          speciale.
        </HelpText>
        <FieldError />
      </FormGroup>
      <FormGroup controlId="repeatPassword">
        <FormLabel>Ripeti nuova password</FormLabel>
        <InputField
          type="password"
          name="repeatPassword"
          placeholder="Ripeti nuova password"
          validation={{
            required: "Ripeti la tua nuova password",
          }}
        />
        <FieldError />
      </FormGroup>
      <FieldError name="root" as={Alert} variant="danger" className="mb-0" />
      <SubmitButton variant="primary" className="w-100">
        {(isLoggingIn) => (
          <>
            <FontAwesomeIcon
              icon={isLoggingIn ? faSpinner : faKey}
              className={cns("me-2", isLoggingIn && "fa-spin")}
            />
            {submitButtonLabel}
          </>
        )}
      </SubmitButton>
    </Form>
  );
}
