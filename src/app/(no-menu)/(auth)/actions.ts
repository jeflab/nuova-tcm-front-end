"use server";

import {AUTH_COOKIE_NAME} from "@/app/(no-menu)/(auth)/const";
import {accountSchema, profileSchema} from "@/models/account";
import {agentSchema} from "@/models/entities/agent";
import {personalDataSchema} from "@/models/entities/personalData";
import {userSchema} from "@/models/entities/user";
import {cookies, headers} from "next/headers";
import {redirect} from "next/navigation";
import {z} from "zod";
import * as api from "@/services/api";

const LoginResponseRawShape = {
  access_token: z.string(),
};

export async function login(data: {fiscalCode: string; password: string}) {
  const body = JSON.stringify({
    fiscal_code: data.fiscalCode,
    password: data.password,
  });

  const loginResponse = await api.post("/login", LoginResponseRawShape, body);
  if (loginResponse.status === "success") {
    cookies().set(AUTH_COOKIE_NAME, loginResponse.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
  }

  return loginResponse;
}

export async function isLoggedIn() {
  const cookie = cookies().get(AUTH_COOKIE_NAME)?.value;
  return !!cookie;
}

export async function logout() {
  const logoutResponsePromise = api.post("/logout", {});
  cookies().delete(AUTH_COOKIE_NAME);

  return await logoutResponsePromise;
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

export async function getAccount() {
  return await api.get("/me", accountSchema.shape);
}

const getProfileShape = {
  user: userSchema,
  agent: agentSchema.nullable(),
  contractor: personalDataSchema.nullable(),
};
export async function getProfile() {
  return await api.get("/profile-me", getProfileShape);
}
