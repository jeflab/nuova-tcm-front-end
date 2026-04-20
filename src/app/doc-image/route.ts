import {NextResponse} from "next/server";

/**
 * @deprecated Usare /doc-image/[contractorId]/[agentId]/[size]/[filename]
 */
export const GET = async () => new NextResponse(null, {status: 410});
