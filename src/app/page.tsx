import {captureException} from "@sentry/nextjs";

export default async function Page() {
  // if (await isLoggedIn()) {
  //   const account = await getAccount();
  //   if (
  //     account?.status === "success" &&
  //     account.permissions?.some(
  //       (permission) => permission.name === "create-lip",
  //     )
  //   ) {
  //     redirect("/lips");
  //   } else {
  //     redirect("/contractorLips");
  //   }
  // }
  // redirect("/login");

  const error = new Error("Non dovresti essere qui.");
  captureException(error);

  throw error;
}
