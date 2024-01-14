import chalk from "chalk";

export const logFetchInfo = async (response: Response, body?: string) => {
  if (process.env.FETCH_DEBUG === "true") {
    try {
      console.log(
        chalk.italic.bold("Chiamata API:"),
        chalk.greenBright(response.url),
      );
      console.log(body ? JSON.parse(body) : "no data");
      console.log(await response.clone().json());
    } catch (e) {
      // fall silently
    }
  }
};
