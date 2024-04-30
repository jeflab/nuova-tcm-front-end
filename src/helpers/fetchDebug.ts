import chalk from "chalk";

export function unrollFetchData(data?: object | FormData) {
  if (data instanceof FormData) {
    return Object.fromEntries([...data.entries()]);
  }
  return data ?? "No data";
}

export const logFetchInfo = async (
  method: string,
  response: Response,
  body?: object | FormData,
) => {
  if (process.env.FETCH_DEBUG === "true") {
    try {
      console.log(
        chalk.italic.bold("Chiamata API:"),
        chalk.cyanBright(method),
        chalk.greenBright(response.url),
        chalk.yellowBright(response.status),
      );
      console.log(unrollFetchData(body));
      console.log(await response.clone().json());
    } catch (e) {
      // fall silently
    }
  }
};
