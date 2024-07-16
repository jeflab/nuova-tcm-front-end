import {AUTH_COOKIE_NAME} from "@/app/(no-menu)/(auth)/const";
import {apiUrl} from "@/services/const";
import {cookies} from "next/headers";
import {NextRequest, NextResponse} from "next/server";
import {z} from "zod";

function authorizationHeader() {
  const authCookie = cookies().get(AUTH_COOKIE_NAME)?.value;
  return authCookie ? {Authorization: `Bearer ${authCookie}`} : undefined;
}

const searchPramsSchema = z.object({
  contractorId: z.coerce.number(),
  agentId: z.coerce.number(),
  filename: z.string(),
  size: z.enum(["thumbnail", "full"]).optional().default("full"),
});

export const GET = async (request: NextRequest) => {
  const searchParams = searchPramsSchema.parse(
    Object.fromEntries(request.nextUrl.searchParams.entries()),
  );

  const headers = {
    ...authorizationHeader(),
  };

  const image = await fetch(
    `${apiUrl}/personal-datas/${searchParams.contractorId}/get-image?filename=${searchParams.filename}&agentId=${searchParams.agentId}&size=${searchParams.size}`,
    {
      redirect: "manual",
      headers,
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

  const blob = await image.arrayBuffer();

  const responseHeaders = new Headers();
  responseHeaders.set("Content-Type", "image/jpg");

  return new NextResponse(blob, {
    status: 200,
    statusText: "OK",
    headers: responseHeaders,
  });
};
