import appInfo from "../package.json" with {type: "json"};
import semver from "semver";
import chalk from "chalk";

const processVersion = process.versions;

if (processVersion?.node && appInfo?.engines?.node) {
  if (semver.satisfies(processVersion.node, appInfo.engines.node)) {
    console.log(
      chalk.green("Good to Go with your Node Version: " + processVersion.node),
    );
  } else {
    console.log(
      chalk.red("Wrong Node Version, required: " + appInfo.engines.node),
    );
    console.log(
      chalk.yellow("Your current Node Version is: " + processVersion.node),
    );
    process.exit(1);
  }
} else {
  console.log(chalk.red("Something went wrong while checking Node version"));
  process.exit(1);
}
