import {getAccount, isLoggedIn} from "@/app/(no-menu)/(auth)/actions";
import {redirect} from "next/navigation";

export default async function Page() {
  if (await isLoggedIn()) {
    const account = await getAccount();
    if (
      account?.status === "success" &&
      account.permissions?.some(
        (permission) => permission.name === "create-lip",
      )
    ) {
      redirect("/lips");
    } else {
      redirect("/contractorLips");
    }
  }
  redirect("/login");
}
