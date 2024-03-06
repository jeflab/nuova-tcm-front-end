import chalk from "chalk";

export const logFetchInfo = async (
  method: string,
  response: Response,
  body?: string,
) => {
  if (process.env.FETCH_DEBUG === "true") {
    try {
      console.log(
        chalk.italic.bold("Chiamata API:"),
        chalk.cyanBright(method),
        chalk.greenBright(response.url),
        chalk.yellowBright(response.status),
      );
      console.log(body ? JSON.parse(body) : "no data");
      console.log(await response.clone().json());
    } catch (e) {
      // fall silently
    }
  }
};
