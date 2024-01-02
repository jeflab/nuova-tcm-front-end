import {isLoggedIn} from "@/app/(public)/(auth)/actions";
import {redirect} from "next/navigation";

export default async function Page() {
  if (await isLoggedIn()) {
    redirect("/lips");
  }
  redirect("/login");
}
