"use client";
import {login} from "@/app/(public)/login/actions";
import {cns} from "@/app/helpers/cns";
import {FieldError} from "@/ui/form/FieldError";
import Form from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {upperCaseNormalizer} from "@/ui/form/normalizers";
import {fiscalCodeValidator} from "@/ui/form/validators";
import {faSpinner} from "@fortawesome/pro-duotone-svg-icons";
import {faSignInAlt} from "@fortawesome/pro-duotone-svg-icons/faSignInAlt";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useState} from "react";
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
} from "react-bootstrap";
import {SubmitHandler} from "react-hook-form";

interface LoginFormValues {
  fiscalCode: string;
  password: string;
}

export function LoginForm() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const handleSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoggingIn(true);
    try {
      const clientResponse = await login(data);
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      <FormGroup controlId="fiscalCode">
        <FormLabel>Codice Fiscale</FormLabel>
        <InputField
          type="text"
          placeholder="Codice Fiscale"
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
          validation={{required: "Inserisci la password"}}
        />
        <FieldError />
      </FormGroup>
      <Button
        variant="primary"
        type="submit"
        className="w-100"
        disabled={isLoggingIn}
      >
        <FontAwesomeIcon
          icon={isLoggingIn ? faSpinner : faSignInAlt}
          className={cns("me-2", isLoggingIn && "fa-spin")}
        />
        Login
      </Button>
    </Form>
  );
}
