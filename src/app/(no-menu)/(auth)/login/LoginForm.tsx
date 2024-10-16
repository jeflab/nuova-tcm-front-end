"use client";

import {login} from "@/app/(no-menu)/(auth)/actions";
import {cns} from "@/helpers/cns";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {upperCaseNormalizer} from "@/ui/form/normalizers";
import {SubmitButton} from "@/ui/form/SubmitButton";
import {fiscalCodeValidator} from "@/ui/form/validators/fiscalCode";
import {faSpinner} from "@fortawesome/pro-duotone-svg-icons";
import {faSignInAlt} from "@fortawesome/pro-duotone-svg-icons/faSignInAlt";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useRouter} from "next/navigation";
import {Alert, FormGroup, FormLabel} from "react-bootstrap";
import * as Sentry from "@sentry/nextjs";

const defaultValues = {
  fiscalCode: "",
  password: "",
};

export function LoginForm() {
  const router = useRouter();

  const handleSubmit = async (data: typeof defaultValues) => {
    let loginResponse: Awaited<ReturnType<typeof login>>;

    try {
      loginResponse = await login(data);
    } catch (error) {
      throw {
        root: {
          type: "server",
          message: "Errore imprevisto, riprova più tardi.",
        },
      };
    }

    if (loginResponse.status !== "success") {
      throw {root: {type: "server", message: loginResponse.message}};
    }

    Sentry.addBreadcrumb({
      message: "login success",
      category: "auth",
      data: {
        loginResponse,
      },
    });

    setTimeout(() => {
      Sentry.addBreadcrumb({
        message: "redirecting after 1ms",
        category: "auth",
      });
      router.push("/");
    }, 1);
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
          autoComplete="codice-fiscale"
          validation={{
            required: "Inserisci il tuo codice fiscale",
            validate: (value) =>
              fiscalCodeValidator(value) || "Codice fiscale non valido",
          }}
          normalize={upperCaseNormalizer}
        />
        <FieldError />
      </FormGroup>
      <FormGroup controlId="password">
        <FormLabel>Password</FormLabel>
        <InputField
          type="password"
          placeholder="Password"
          autoComplete="current-password"
          validation={{required: "Inserisci la password"}}
        />
        <FieldError />
      </FormGroup>
      <FieldError name="root" as={Alert} variant="danger" className="mb-0" />
      <SubmitButton variant="primary" className="w-100">
        {(isLoggingIn) => (
          <>
            <FontAwesomeIcon
              icon={isLoggingIn ? faSpinner : faSignInAlt}
              className={cns("me-2", isLoggingIn && "fa-spin")}
            />
            Login
          </>
        )}
      </SubmitButton>
    </Form>
  );
}
