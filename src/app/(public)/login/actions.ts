"use server";
import {cookies} from "next/headers";

const thirtyDaysInSeconds = 2592000;

function extractCookieValue(cookieString: string, cookieName: string) {
  const regex = new RegExp(`${cookieName}=([^;]+)`);
  return cookieString.match(regex)?.[1];
}

export async function login(data: {fiscalCode: string; password: string}) {
  const nextCookie = cookies();

  const body = JSON.stringify({
    fiscal_code: data.fiscalCode,
    password: data.password,
  });

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const loginResponse = await fetch("http://127.0.0.1:8000/api/login", {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body,
    credentials: "include",
  });

  const backendCookie = loginResponse.headers.getSetCookie();

  console.log("status: " + loginResponse.status);
  console.log(loginResponse);
  console.log("backendCookie: ", backendCookie);

  let serverResponse: object | string;
  try {
    serverResponse = await loginResponse.clone().json();
  } catch (e) {
    serverResponse = await loginResponse.clone().text();
  }

  console.log("serverResponse: ", serverResponse);

  return "status: " + loginResponse.status;

  // const phpCookie = extractCookieValue(
  //   backendCookie[backendCookie.length - 1],
  //   "PHPSESSID",
  // );
  //
  // if (phpCookie) {
  //   nextCookie.set({
  //     name: "PHPSESSID",
  //     value: phpCookie,
  //     httpOnly: true,
  //     sameSite: "strict",
  //     secure: true,
  //     path: "/",
  //     maxAge: thirtyDaysInSeconds,
  //     expires: new Date(Date.now() + thirtyDaysInSeconds * 1000),
  //   });
  // }
  //
  // const loginJson = await loginResponse.json();
  // delete loginJson.user;
  //
  // return loginJson;
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
