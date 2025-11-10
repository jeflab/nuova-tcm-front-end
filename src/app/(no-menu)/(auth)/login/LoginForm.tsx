"use client";

import {login} from "@/app/(no-menu)/(auth)/actions";
import {cns} from "@/helpers/cns";
import {normalizeError} from "@/helpers/errors";
import {jwtSchema} from "@/models/jwt";
import {FieldError} from "@/ui/form/FieldError";
import {Form} from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {upperCaseNormalizer} from "@/ui/form/normalizers";
import {SubmitButton} from "@/ui/form/SubmitButton";
import {fiscalCodeValidator} from "@/ui/form/validators/fiscalCode";
import {faSpinner} from "@fortawesome/pro-duotone-svg-icons";
import {faSignInAlt} from "@fortawesome/pro-duotone-svg-icons/faSignInAlt";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {decodeJwt} from "jose";
import {redirect} from "next/navigation";
import {useState} from "react";
import {Alert, FormGroup, FormLabel} from "react-bootstrap";

const defaultValues = {
  fiscalCode: "",
  password: "",
};

interface LoginFormProps {
  searchParamsJson: string | undefined;
}

export function LoginForm({searchParamsJson}: LoginFormProps) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleSubmit = async (data: typeof defaultValues) => {
    let loginResponse: Awaited<ReturnType<typeof login>>;

    try {
      loginResponse = await login(data);
    } catch {
      throw {
        root: {
          type: "server",
          message: "Errore imprevisto, riprova più tardi.",
        },
      };
    }

    if (loginResponse?.status !== "success") {
      throw {
        root: {type: "server", message: normalizeError(loginResponse).message},
      };
    }

    setIsRedirecting(true);

    if (searchParamsJson) {
      const searchParams = JSON.parse(searchParamsJson);
      const next = searchParams.next as string;
      delete searchParams.next;

      const newSearchParamsString = new URLSearchParams(
        searchParams,
      ).toString();

      if (next) {
        return redirect(
          next + (newSearchParamsString ? `?${newSearchParamsString}` : ""),
        );
      }
    }

    if (loginResponse.access_token) {
      let userPermissions: string[] = [];
      try {
        const decodedToken = decodeJwt(loginResponse.access_token);
        const parsedToken = jwtSchema.parse(decodedToken);

        userPermissions = Object.values(parsedToken.permissions ?? {});
      } catch (error) {
        console.error("Impossibile leggere il token JWT:", error);
        return redirect("/");
      }

      if (userPermissions?.some((permission) => permission === "create-lip")) {
        return redirect("/lips");
      } else if (
        userPermissions?.some(
          (permission) => permission === "contractor-read-lip",
        )
      ) {
        return redirect("/contractorLips");
      } else {
        return redirect("/profile");
      }
    }
    return redirect("/");
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
      <SubmitButton
        variant="primary"
        className="w-100"
        disabled={isRedirecting}
      >
        {(isLoggingIn) => (
          <>
            <FontAwesomeIcon
              icon={isLoggingIn || isRedirecting ? faSpinner : faSignInAlt}
              className={cns(
                "me-2",
                (isLoggingIn || isRedirecting) && "fa-spin",
              )}
            />
            {isRedirecting ? "Reindirizzamento..." : "Login"}
          </>
        )}
      </SubmitButton>
    </Form>
  );
}
