import * as appInfo from "../../package.json";
export function getRelease() {
  return `${appInfo.name}@${getVersion()}`;
}

export function getVersion() {
  const commitSha =
    process.env.NODE_ENV === "development"
      ? ".local-dev"
      : process.env.VERCEL_ENV === "preview" &&
          process.env.VERCEL_GIT_COMMIT_SHA
        ? "." + process.env.VERCEL_GIT_COMMIT_SHA.substring(0, 7)
        : "";

  console.log(`process.env.NODE_ENV`, process.env.NODE_ENV);
  console.log(`process.env.VERCEL_ENV`, process.env.VERCEL_ENV);
  console.log(
    `process.env.VERCEL_GIT_COMMIT_SHA`,
    process.env.VERCEL_GIT_COMMIT_SHA,
  );
  console.log(`Release: ${appInfo.version}${commitSha}`);

  return `${appInfo.version}${commitSha}`;
}
