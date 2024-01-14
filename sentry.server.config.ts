// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import appInfo from "./package.json";

Sentry.init({
  dsn: "https://cf295f6b6cf51e267fdfd84c56895dcf@o66710.ingest.sentry.io/4506546631081984",
  release: `${appInfo.name}@${appInfo.version}`,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
