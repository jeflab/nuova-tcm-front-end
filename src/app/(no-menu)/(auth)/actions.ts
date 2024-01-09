"use server";

import {AUTH_COOKIE_NAME} from "@/app/(no-menu)/(auth)/const";
import {isServerError} from "@/services/helpers";
import {cookies, headers} from "next/headers";
import {redirect} from "next/navigation";
import {z} from "zod";
import * as api from "@/services/api";

const LoginResponseRawShape = {
  access_token: z.string(),
};

export async function login(data: {fiscalCode: string; password: string}) {
  try {
    const body = JSON.stringify({
      fiscal_code: data.fiscalCode,
      password: data.password,
    });

    const loginResponse = await api.post("/login", LoginResponseRawShape, body);
    cookies().set(AUTH_COOKIE_NAME, loginResponse.access_token);

    return loginResponse;
  } catch (e) {
    console.error(e);
    if (isServerError(e)) {
      return e;
    }
    throw e;
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
  const headersList = headers();
  const referer = headersList.get("referer");
  const searchParams = new URLSearchParams({next: referer ?? ""});

  const cookie = cookies().get(AUTH_COOKIE_NAME)?.value;

  if (!cookie) {
    redirect("/login" + (referer ? "?" + searchParams.toString() : ""));
  }
}
