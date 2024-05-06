"use server";

import {AUTH_COOKIE_NAME, COOKIE_DURATION} from "@/app/(no-menu)/(auth)/const";
import {accountSchema} from "@/models/account";
import {agentSchema} from "@/models/entities/agent";
import {personalDataSchema} from "@/models/entities/personalData";
import {userSchema} from "@/models/entities/user";
import {Tags} from "@/services/const";
import {invalidateTag} from "@/services/helpers";
import {cookies, headers} from "next/headers";
import {redirect} from "next/navigation";
import {z} from "zod";
import * as api from "@/services/api";

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

  if (loginResponse.status === "success") {
    cookies().set(AUTH_COOKIE_NAME, loginResponse.access_token, {
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
  token: string;
  password: string;
}
export async function setPassword(data: SetPasswordParams) {
  const setPasswordResponse = await api.post("/set-password", {
    payloadShape: LoginResponseRawShape,
    data,
  });
  if (setPasswordResponse.status === "success") {
    cookies().set(AUTH_COOKIE_NAME, setPasswordResponse.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: COOKIE_DURATION,
      expires: new Date(Date.now() + COOKIE_DURATION * 1000),
    });
  }

  return setPasswordResponse;
}

export async function isLoggedIn() {
  const cookie = cookies().get(AUTH_COOKIE_NAME)?.value;
  return !!cookie;
}

export async function logout() {
  const logoutResponsePromise = api.post("/logout", {});
  invalidateTag(Tags.me());
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
  return await api.get("/me", {
    payloadShape: accountSchema.shape,
    tags: [Tags.me()],
  });
}

const getProfileShape = {
  user: userSchema,
  agent: agentSchema.nullable(),
  contractor: personalDataSchema.nullable(),
};
export async function getProfile() {
  return await api.get("/profile-me", {payloadShape: getProfileShape});
}
