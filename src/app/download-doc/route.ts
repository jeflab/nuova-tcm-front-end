"use server";

import {AUTH_COOKIE_NAME} from "@/app/(no-menu)/(auth)/const";
import {
  DownloadDocumentsSearchParams,
  searchPramsSchema,
} from "@/app/download-doc/schema";
import {apiUrl} from "@/services/const";
import * as Sentry from "@sentry/nextjs";
import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

// const privacySchema = z.object({uri: z.literal("pdf-privacy"),lipId: z.coerce.number(),agentId: z.coerce.number(),contractorId: z.coerce.number()});
// const allegato3Schema = z.object({uri: z.literal("pdf-allegato3"),lipId: z.coerce.number(),agentId: z.coerce.number()});
// const allegato4terSchema = z.object({uri: z.literal("pdf-allegato4ter"),lipId: z.coerce.number(),agentId: z.coerce.number()});
// const elencoCompagnieSchema = z.object({uri: z.literal("pdf-elenco-compagnie"),lipId: z.coerce.number(),agentId: z.coerce.number()});
// const identificazioneSchema = z.object({uri: z.literal("pdf-identificazione"),lipId: z.coerce.number(),agentId: z.coerce.number(),contractorId: z.coerce.number()});
// const identificazionePreviewSchema = z.object({uri: z.literal("pdf-identificazione-preview"),lipId: z.coerce.number(),agentId: z.coerce.number(),contractorId: z.coerce.number()});
// const propostaSchema = z.object({uri: z.literal("pdf-proposta"),lipId: z.coerce.number(),agentId: z.coerce.number(),contractorId: z.coerce.number()});
// const propostaPreviewSchema = z.object({uri: z.literal("pdf-proposta-preview"),lipId: z.coerce.number(),agentId: z.coerce.number(),contractorId: z.coerce.number()});
// const allegato4Schema = z.object({uri: z.literal("pdf-allegato4"),lipId: z.coerce.number(),agentId: z.coerce.number(),contractorId: z.coerce.number()});
// const setInformativoSchema = z.object({uri: z.literal("set-informativo"),lipId: z.coerce.number(),agentId: z.coerce.number(),contractorId: z.coerce.number()});
// const underwritingSanitarioSchema = z.object({uri: z.literal("pdf-underwriting-sanitario"),lipId: z.coerce.number(),agentId: z.coerce.number(),contractorId: z.coerce.number()});
// const certificatoSchema = z.object({uri: z.literal("pdf-certificato"),lipId: z.coerce.number(),agentId: z.coerce.number(),contractorId: z.coerce.number()});

async function authorizationHeader() {
  const authCookie = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  return authCookie ? {Authorization: `Bearer ${authCookie}`} : undefined;
}

const mimeTypes: Record<
  DownloadDocumentsSearchParams["uri"],
  "application/pdf" | "application/zip"
> = {
  "pdf-allegato3": "application/pdf",
  "pdf-allegato4": "application/pdf",
  "pdf-allegato4ter": "application/pdf",
  "pdf-certificato": "application/zip",
  "pdf-elenco-compagnie": "application/pdf",
  "pdf-identificazione": "application/pdf",
  "pdf-identificazione-preview": "application/pdf",
  "pdf-privacy": "application/pdf",
  "pdf-proposta": "application/pdf",
  "pdf-proposta-preview": "application/pdf",
  "pdf-underwriting-sanitario": "application/pdf",
  "pdf-underwriting-sportivo": "application/pdf",
  "set-informativo": "application/zip",
  "pdf-identificazione-assicurato": "application/pdf",
  "pdf-identificazione-assicurato-preview": "application/pdf",
  "pdf-dur": "application/pdf",
  "pdf-mup": "application/pdf",
};

export const GET = async (request: NextRequest) => {
  const searchParams = searchPramsSchema.parse(
    Object.fromEntries(request.nextUrl.searchParams.entries()),
  );

  const headers = {
    ...(await authorizationHeader()),
  };

  const queryString = new URLSearchParams({
    lipId: searchParams.lipId.toString(),
    ...("agentId" in searchParams && {
      agentId: searchParams.agentId.toString(),
    }),
    ...("contractorId" in searchParams && {
      contractorId: searchParams.contractorId.toString(),
    }),
    ...("year" in searchParams && {
      year: searchParams.year.toString(),
    }),
  });

  const document = await fetch(`${apiUrl}/${searchParams.uri}?${queryString}`, {
    redirect: "manual",
    headers,
  });
  if (document.status !== 200) {
    Sentry.captureMessage(
      `Errore nel caricamento del documento: ${JSON.stringify({response: await document.clone().text(), url: `${apiUrl}/${searchParams.uri}?${queryString}`})}`,
    );

    const json = await document.json();
    return new NextResponse(
      JSON.stringify({
        status: "failed",
        message:
          "Impossibile caricare il documento" +
          (json.message ? `: ${json.message}` : ""),
      }),
      {status: 500},
    );
  }

  const blob = await document.arrayBuffer();

  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", mimeTypes[searchParams.uri]);
  responseHeaders.set(
    "Content-Disposition",
    document.headers.get("Content-Disposition") ??
      `attachment; filename=${searchParams.uri}.pdf`,
  );

  return new NextResponse(blob, {
    status: 200,
    statusText: "OK",
    headers: responseHeaders,
  });
};
