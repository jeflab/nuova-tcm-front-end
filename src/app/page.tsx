import {isLoggedIn} from "@/app/(no-menu)/(auth)/actions";
import {redirect} from "next/navigation";

export default async function Page() {
  if (await isLoggedIn()) {
    redirect("/lips");
  }
  redirect("/quoter");
}
