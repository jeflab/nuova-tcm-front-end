"use server";
import {AUTH_COOKIE_NAME} from "@/app/(public)/(auth)/const";
import {userSchema} from "@/entities/user";
import {cookies} from "next/headers";
import {z} from "zod";

const getAccountSchema = z.object({
  user: userSchema,
});

// export async function getAccount() {
//   try {
//     const getAccountResponse = await fetch("http://127.0.0.1:8000/api/user", {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       method: "POST",
//       body,
//       credentials: "include",
//     });
//
//     const serverResponseJson = LoginResponseSchema.parse(
//       await loginResponse.clone().json(),
//     );
//     if (serverResponseJson.status === "success") {
//       cookies().set(AUTH_COOKIE_NAME, serverResponseJson.access_token);
//       return serverResponseJson;
//     } else {
//       return serverResponseJson;
//     }
//   } catch (e) {
//     console.error(e);
//     return {status: "failed", message: "Errore imprevisto, riprova più tardi"};
//   }
// }
