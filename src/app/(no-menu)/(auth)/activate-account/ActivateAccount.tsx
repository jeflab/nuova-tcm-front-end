"use client";

import {SetPasswordForm} from "@/app/(no-menu)/(auth)/password-reset/SetPasswordForm";
import {backendUrl} from "@/services/const";
import {ButtonLink} from "@/ui/ButtonLink";
import autoAnimate from "@formkit/auto-animate";
import {useEffect, useRef, useState} from "react";
import {Alert, Card} from "react-bootstrap";

interface ActivateAccountParams {
  token: string;
  email: string;
}

export function ActivateAccount(props: ActivateAccountParams) {
  const animateContainer = useRef<HTMLDivElement>(null);
  const [passwordSet, setPasswordSet] = useState<boolean>(false);
  useEffect(() => {
    animateContainer.current && autoAnimate(animateContainer.current);
  }, []);

  return (
    <div ref={animateContainer}>
      {passwordSet ? (
        <Alert variant="success">
          <h3>Recupera password</h3>
          <p>
            Il tuo account è stato attivato con successo. Ora puoi effettuare il
            login.
          </p>
          <ButtonLink href="/login" className="w-100 mb-3">
            Login
          </ButtonLink>
          <ButtonLink href={`${backendUrl}admin/login`} className="w-100">
            Login Admin
          </ButtonLink>
        </Alert>
      ) : (
        <Card body className="w-100">
          <Alert variant="info">
            Inserisci il codice che hai ricevuto via mail e scegli una password
            per attivare il tuo account
          </Alert>
          <SetPasswordForm
            token={props.token}
            email={props.email}
            submitButtonLabel="Attiva il tuo account"
            onPasswordSet={() => setPasswordSet(true)}
          />
          <ButtonLink variant="link" href="/login" className="w-100">
            Login
          </ButtonLink>
        </Card>
      )}
    </div>
  );
}
