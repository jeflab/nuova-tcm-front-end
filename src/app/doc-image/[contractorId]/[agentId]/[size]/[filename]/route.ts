import {AUTH_COOKIE_NAME} from "@/app/(no-menu)/(auth)/const";
import {apiUrl} from "@/services/const";
import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";

async function authorizationHeader() {
  const authCookie = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  return authCookie ? {Authorization: `Bearer ${authCookie}`} : undefined;
}

const paramsSchema = z.object({
  contractorId: z.coerce.number(),
  agentId: z.coerce.number(),
  size: z.enum(["thumbnail", "full"]),
  filename: z.string().min(1),
});

export const GET = async (
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      contractorId: string;
      agentId: string;
      size: string;
      filename: string;
    }>;
  },
) => {
  const parsed = paramsSchema.safeParse(await params);

  if (!parsed.success) {
    return new NextResponse(
      JSON.stringify({status: "failed", message: "Parametri non validi"}),
      {status: 400},
    );
  }

  const {contractorId, agentId, size, filename} = parsed.data;

  const image = await fetch(
    `${apiUrl}/personal-datas/${contractorId}/get-image?filename=${encodeURIComponent(filename)}&agentId=${agentId}&size=${size}`,
    {
      redirect: "manual",
      headers: {...(await authorizationHeader())},
    },
  );

  if (image.status !== 200) {
    return new NextResponse(
      JSON.stringify({
        status: "failed",
        message: "Impossibile caricare l'immagine",
      }),
      {status: 500},
    );
  }

  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", "image/jpg");

  return new NextResponse(await image.arrayBuffer(), {
    status: 200,
    statusText: "OK",
    headers: responseHeaders,
  });
};
