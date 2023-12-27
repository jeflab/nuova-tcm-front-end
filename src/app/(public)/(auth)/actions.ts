"use server";
import {AUTH_COOKIE_NAME} from "@/app/(public)/(auth)/const";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {z, ZodRawShape} from "zod";

const createApiSchema = <T extends ZodRawShape>(successSchema: T) =>
  z
    .object({
      status: z.literal("failed"),
      message: z.string(),
    })
    .or(
      z
        .object({
          status: z.literal("success"),
        })
        .extend(successSchema),
    );

const LoginResponseSchema = createApiSchema({
  access_token: z.string(),
});

export async function login(data: {fiscalCode: string; password: string}) {
  try {
    const body = JSON.stringify({
      fiscal_code: data.fiscalCode,
      password: data.password,
    });

    const loginResponse = await fetch("http://127.0.0.1:8000/api/login", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body,
      credentials: "include",
    });

    const serverResponseJson = LoginResponseSchema.parse(
      await loginResponse.clone().json(),
    );
    if (serverResponseJson.status === "success") {
      cookies().set(AUTH_COOKIE_NAME, serverResponseJson.access_token);
      return serverResponseJson;
    } else {
      return serverResponseJson;
    }
  } catch (e) {
    console.error(e);
    return {status: "failed", message: "Errore imprevisto, riprova più tardi"};
  }
}

export async function isLoggedIn() {
  const cookie = cookies().get(AUTH_COOKIE_NAME)?.value;
  return !!cookie;
}

export async function logout() {
  cookies().delete(AUTH_COOKIE_NAME);
}

export async function checkAuth() {
  const cookie = cookies().get(AUTH_COOKIE_NAME)?.value;

  if (!cookie) {
    redirect("/login");
  }
}
