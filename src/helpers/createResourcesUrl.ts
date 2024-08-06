import {
  DownloadDocumentsSearchParams,
  searchPramsSchema,
} from "@/app/download-doc/schema";

interface CreateDocumentImageUrlOptions {
  contractorId?: number;
  agentId?: number;
  fileName?: string;
  size?: "thumbnail" | "full";
}

export function createIDImageUrl({
  contractorId,
  agentId,
  fileName,
  size,
}: CreateDocumentImageUrlOptions) {
  if (!contractorId || !agentId || !fileName || !size) {
    return undefined;
  }

  return encodeURI(
    `/doc-image?contractorId=${contractorId}&filename=${fileName}&agentId=${agentId}&size=${size}`,
  );
}

export function createDocumentUrl(params: DownloadDocumentsSearchParams) {
  const safeParams = searchPramsSchema.safeParse(params);
  if (!safeParams.success) {
    return "error";
  }

  const queryString = new URLSearchParams({
    uri: safeParams.data.uri,
    lipId: safeParams.data.lipId.toString(),
    agentId: safeParams.data.agentId.toString(),
    ...("contractorId" in safeParams.data && {
      contractorId: safeParams.data.contractorId.toString(),
    }),
  });

  return encodeURI(`/download-doc?${queryString.toString()}`);
}
