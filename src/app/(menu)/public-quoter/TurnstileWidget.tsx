"use client";

import {forwardRef, useEffect, useImperativeHandle, useRef} from "react";

/**
 * Manico imperativo esposto al form: `getToken()` esegue una singola sfida
 * Turnstile e risolve con il token da inviare al server. Se il widget non è
 * configurato (site key assente) risolve con stringa vuota, così in locale il
 * preventivatore funziona anche senza captcha (il back-end, senza secret,
 * salta comunque la verifica).
 */
export interface TurnstileHandle {
  getToken: () => Promise<string>;
}

interface TurnstileRenderOptions {
  sitekey: string;
  appearance?: "always" | "execute" | "interaction-only";
  execution?: "render" | "execute";
  callback?: (token: string) => void;
  "error-callback"?: () => void;
  "expired-callback"?: () => void;
  "timeout-callback"?: () => void;
}

interface TurnstileApi {
  render: (el: HTMLElement, options: TurnstileRenderOptions) => string;
  execute: (widgetId: string) => void;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// Caricato una sola volta a livello di modulo, condiviso tra istanze.
let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("Impossibile caricare Cloudflare Turnstile"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export const TurnstileWidget = forwardRef<TurnstileHandle, {siteKey?: string}>(
  function TurnstileWidget({siteKey}, ref) {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const pendingRef = useRef<{
      resolve: (token: string) => void;
      reject: (error: Error) => void;
    } | null>(null);

    const settlePending = (token: string | null, error?: Error) => {
      const pending = pendingRef.current;
      if (!pending) return;
      pendingRef.current = null;
      if (token !== null) {
        pending.resolve(token);
      } else {
        pending.reject(error ?? new Error("Verifica Turnstile non riuscita"));
      }
    };

    useEffect(() => {
      if (!siteKey) return;

      let cancelled = false;

      loadTurnstileScript()
        .then(() => {
          if (
            cancelled ||
            !containerRef.current ||
            widgetIdRef.current !== null ||
            !window.turnstile
          ) {
            return;
          }

          widgetIdRef.current = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            // Il più invisibile possibile: la sfida gira solo su execute() e il
            // widget compare unicamente se serve un'interazione umana.
            appearance: "interaction-only",
            execution: "execute",
            callback: (token) => settlePending(token),
            "error-callback": () =>
              settlePending(null, new Error("Errore nella verifica Turnstile")),
            "expired-callback": () =>
              settlePending(null, new Error("Verifica Turnstile scaduta")),
            "timeout-callback": () =>
              settlePending(null, new Error("Verifica Turnstile scaduta")),
          });
        })
        .catch((error: Error) => settlePending(null, error));

      return () => {
        cancelled = true;
        settlePending(null, new Error("Widget Turnstile smontato"));
        if (widgetIdRef.current !== null && window.turnstile) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }
      };
    }, [siteKey]);

    useImperativeHandle(
      ref,
      () => ({
        getToken: () =>
          new Promise<string>((resolve, reject) => {
            // Captcha non configurato: nessuna verifica lato client.
            if (!siteKey) {
              resolve("");
              return;
            }

            if (!window.turnstile || widgetIdRef.current === null) {
              reject(new Error("Verifica di sicurezza non pronta"));
              return;
            }

            // Una richiesta di token alla volta.
            settlePending(null, new Error("Verifica di sicurezza annullata"));
            pendingRef.current = {resolve, reject};

            // reset() garantisce un token fresco a ogni preventivo (i token
            // Turnstile sono monouso), poi execute() avvia la sfida.
            window.turnstile.reset(widgetIdRef.current);
            window.turnstile.execute(widgetIdRef.current);
          }),
      }),
      [siteKey],
    );

    if (!siteKey) return null;

    return <div ref={containerRef} />;
  },
);
