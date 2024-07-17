interface CreateDocumentImageUrlOptions {
  contractorId?: number;
  agentId?: number;
  fileName?: string;
  size?: "thumbnail" | "full";
}

export function createDocumentImageUrl({
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
