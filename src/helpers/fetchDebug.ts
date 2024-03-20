import chalk from "chalk";

export const logFetchInfo = async (
  method: string,
  response: Response,
  body?: string | FormData,
) => {
  if (process.env.FETCH_DEBUG === "true") {
    try {
      console.log(
        chalk.italic.bold("Chiamata API:"),
        chalk.cyanBright(method),
        chalk.greenBright(response.url),
        chalk.yellowBright(response.status),
      );
      console.log(
        body ? (typeof body === "string" ? JSON.parse(body) : body) : "no data",
      );
      console.log(await response.clone().json());
    } catch (e) {
      // fall silently
    }
  }
};
