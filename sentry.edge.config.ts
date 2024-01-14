// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import {getRelease} from "@/release";
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://cf295f6b6cf51e267fdfd84c56895dcf@o66710.ingest.sentry.io/4506546631081984",
  release: getRelease(),

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
