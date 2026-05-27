import {
  DownloadDocumentsSearchParams,
  searchPramsSchema,
} from "@/app/download-doc/schema";

interface CreateDocumentImageUrlOptions {
  personalDataId?: number;
  agentId?: number;
  fileName?: string;
  size?: "thumbnail" | "full";
}

export function createIDImageUrl({
  personalDataId,
  agentId,
  fileName,
  size = "full",
}: CreateDocumentImageUrlOptions) {
  if (!personalDataId || !agentId || !fileName || !size) {
    return undefined;
  }

  return `/doc-image/${personalDataId}/${agentId}/${size}/${fileName}`;
}

export function createDocumentUrl(params: DownloadDocumentsSearchParams) {
  const safeParams = searchPramsSchema.safeParse(params);
  if (!safeParams.success) {
    return "error";
  }

  const queryString = new URLSearchParams({
    uri: safeParams.data.uri,
    lipId: safeParams.data.lipId.toString(),
    ...("agentId" in safeParams.data && {
      agentId: safeParams.data.agentId.toString(),
    }),
    ...("contractorId" in safeParams.data && {
      contractorId: safeParams.data.contractorId.toString(),
    }),
    ...("year" in safeParams.data && {
      year: safeParams.data.year.toString(),
    }),
  });

  return encodeURI(`/download-doc?${queryString.toString()}`);
}
