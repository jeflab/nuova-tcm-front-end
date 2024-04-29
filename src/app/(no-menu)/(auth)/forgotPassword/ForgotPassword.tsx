"use client";

import {ForgotPasswordForm} from "@/app/(no-menu)/(auth)/forgotPassword/ForgotPasswordForm";
import {ButtonLink} from "@/ui/ButtonLink";
import autoAnimate from "@formkit/auto-animate";
import {useEffect, useRef, useState} from "react";
import {Alert, Card} from "react-bootstrap";

const containerStyle = {"--content-width": "400px"};

export default function ForgotPasswordPage() {
  const animateContainer = useRef<HTMLDivElement>(null);
  const [mailSentTo, setMailSentTo] = useState<string | null>(null);

  useEffect(() => {
    animateContainer.current && autoAnimate(animateContainer.current);
  }, []);

  return (
    <div ref={animateContainer}>
      {mailSentTo ? (
        <Alert variant="success">
          <h3>Recupera password</h3>
          <p className="mb-0">
            Controlla la tua casella di posta &ldquo;{mailSentTo}&rdquo;. Ti
            abbiamo inviato una email con il link per impostare la tua nuova
            password.
          </p>
        </Alert>
      ) : (
        <Card body className="w-100">
          <Alert variant="info">
            Inserisci il tuo codice fiscale. Ti invieremo un messaggio con le
            istruzioni per impostare una nuova password.
          </Alert>
          <ForgotPasswordForm
            onResetSuccess={(email) => {
              setMailSentTo(email);
            }}
          />
          <ButtonLink variant="link" href="/login" className="w-100">
            Login
          </ButtonLink>
        </Card>
      )}
    </div>
  );
}
