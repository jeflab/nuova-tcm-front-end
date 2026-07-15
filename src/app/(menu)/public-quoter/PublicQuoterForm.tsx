"use client";

import type {GetQuoteParams} from "@/app/(menu)/(authenticated)/quoter/buildQuotePayload";
import {QuoterForm} from "@/app/(menu)/(authenticated)/quoter/QuoterForm";
import {useRef} from "react";
import {getPublicQuote} from "./actions";
import {TurnstileWidget, type TurnstileHandle} from "./TurnstileWidget";

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function PublicQuoterForm() {
  const turnstileRef = useRef<TurnstileHandle>(null);

  const quoteAction = async (values: GetQuoteParams) => {
    let token: string;
    try {
      token = (await turnstileRef.current?.getToken()) ?? "";
    } catch (error) {
      console.error(error);
      return {
        status: "failed" as const,
        message:
          "Verifica di sicurezza non riuscita. Ricarica la pagina e riprova.",
        responseStatus: 400,
      };
    }

    return getPublicQuote(values, token);
  };

  return (
    <>
      <QuoterForm getQuoteAction={quoteAction} />
      <TurnstileWidget ref={turnstileRef} siteKey={turnstileSiteKey} />
    </>
  );
}
