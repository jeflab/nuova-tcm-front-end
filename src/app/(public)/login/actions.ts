"use server";

import {objToFormData} from "@/ui/form/helpers";
import {cookies} from "next/headers";

const thirtyDaysInSeconds = 2592000;

function extractCookieValue(cookieString: string, cookieName: string) {
  const regex = new RegExp(`${cookieName}=([^;]+)`);
  return cookieString.match(regex)?.[1];
}

export async function login(data: {cf: string; password: string}) {
  const formData = objToFormData(data);

  const nextCookie = cookies();

  const loginResponse = await fetch(
    "http://localhost/jefhttpdocs/akomi/prevision-family/master/back-end/public/login",
    {
      method: "POST",
      body: formData,
      credentials: "include",
      cache: "no-store",
    },
  );

  const backendCookie = loginResponse.headers.getSetCookie();
  const phpCookie = extractCookieValue(
    backendCookie[backendCookie.length - 1],
    "PHPSESSID",
  );

  if (phpCookie) {
    nextCookie.set({
      name: "PHPSESSID",
      value: phpCookie,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      path: "/",
      maxAge: thirtyDaysInSeconds,
      expires: new Date(Date.now() + thirtyDaysInSeconds * 1000),
    });
  }

  const loginJson = await loginResponse.json();
  delete loginJson.user;

  return loginJson;
}

export async function listCaps() {
  const nextCookie = cookies();
  const phpCookie = nextCookie.get("PHPSESSID");

  const capsResponse = await fetch(
    "http://localhost/jefhttpdocs/akomi/prevision-family/master/back-end/public/caps",
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
      headers: {
        cookie: `PHPSESSID=${phpCookie?.value}`,
      },
    },
  );

  return capsResponse.json();
}
