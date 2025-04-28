"use server";

import {AUTH_COOKIE_NAME, COOKIE_DURATION} from "@/app/(no-menu)/(auth)/const";
import {accountSchema} from "@/models/account";
import {agentSchema} from "@/models/entities/agent";
import {contractorSchema} from "@/models/entities/personalData";
import {userSchema} from "@/models/entities/user";
import * as api from "@/services/api";
import {Tags} from "@/services/const";
import {invalidateTag} from "@/services/helpers";
import {cookies, headers} from "next/headers";
import {redirect} from "next/navigation";
import {z} from "zod";

const LoginResponseRawShape = {
  access_token: z.string(),
};

interface LoginParams {
  fiscalCode: string;
  password: string;
}
export async function login(data: LoginParams) {
  const loginResponse = await api.post("/login", {
    payloadShape: LoginResponseRawShape,
    data: {
      fiscal_code: data.fiscalCode,
      password: data.password,
    },
  });

  if (loginResponse?.status === "success") {
    (await cookies()).set(AUTH_COOKIE_NAME, loginResponse.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: COOKIE_DURATION,
      expires: new Date(Date.now() + COOKIE_DURATION * 1000),
    });
  }

  return loginResponse;
}

interface ForgotPasswordParams {
  fiscalCode: string;
}
const forgotPasswordResponseShape = {
  email: z.string(),
};
export async function forgotPassword(data: ForgotPasswordParams) {
  return api.post("/forgot-password", {
    payloadShape: forgotPasswordResponseShape,
    data: {
      fiscal_code: data.fiscalCode,
    },
  });
}

interface SetPasswordParams {
  email: string;
  token: string;
  password: string;
}
export async function setPassword(data: SetPasswordParams) {
  return await api.post("/set-password", {
    data,
  });
}

export async function isLoggedIn() {
  const cookie = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  return !!cookie;
}

export async function logout() {
  const logoutResponsePromise = api.post("/logout", {});
  invalidateTag(Tags.me());
  (await cookies()).delete(AUTH_COOKIE_NAME);

  return await logoutResponsePromise;
}

export async function checkAuth() {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const searchParams = new URLSearchParams({next: referer ?? ""});

  const cookie = (await cookies()).get(AUTH_COOKIE_NAME)?.value;

  if (!cookie) {
    redirect("/login" + (referer ? "?" + searchParams.toString() : ""));
  }
}

export async function getAccount() {
  return await api.get("/me", {
    payloadShape: accountSchema.shape,
    provideTags: [Tags.me()],
  });
}

const getProfileShape = {
  user: userSchema,
  agent: agentSchema.nullable(),
  contractor: contractorSchema.nullable(),
};
export async function getProfile() {
  return await api.get("/profile-me", {payloadShape: getProfileShape});
}
