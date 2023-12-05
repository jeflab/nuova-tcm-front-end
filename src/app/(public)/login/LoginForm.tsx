"use client";
import {login} from "@/app/(public)/login/actions";
import {FieldError} from "@/ui/form/FieldError";
import Form from "@/ui/form/Form";
import {InputField} from "@/ui/form/InputField";
import {faSignInAlt} from "@fortawesome/pro-duotone-svg-icons/faSignInAlt";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  FormText,
} from "react-bootstrap";
import {SubmitHandler} from "react-hook-form";

interface LoginFormValues {
  cf: string;
  password: string;
}

export function LoginForm() {
  const handleSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    console.log(data);
    const clientResponse = await login(data);
    console.log(clientResponse);
  };

  return (
    <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
      <FormGroup controlId="cf">
        <FormLabel>Codice Fiscale</FormLabel>
        <InputField
          type="text"
          placeholder="Codice Fiscale"
          validation={{required: "Inserisci il tuo codice fiscale"}}
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
      <Button variant="primary" type="submit" className="w-100">
        Login <FontAwesomeIcon icon={faSignInAlt} />
      </Button>
    </Form>
  );
}
