"use client";
import {SetPasswordForm} from "@/app/(no-menu)/(auth)/password-reset/SetPasswordForm";
import {ButtonLink} from "@/ui/ButtonLink";
import autoAnimate from "@formkit/auto-animate";
import {useEffect, useRef, useState} from "react";
import {Alert, Card} from "react-bootstrap";

export function SetPassword(props: {token: string; email: string}) {
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
            La tua password è stata impostata con successo. Ora puoi effettuare
            il login.
          </p>
          <ButtonLink href="/login" className="w-100">
            Login
          </ButtonLink>
        </Alert>
      ) : (
        <Card body className="w-100">
          <Alert variant="info">
            Inserisci il codice che hai ricevuto via mail e scegli una password
            per ripristinare la tua password
          </Alert>
          <SetPasswordForm
            token={props.token}
            email={props.email}
            submitButtonLabel="Imposta nuova password"
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
