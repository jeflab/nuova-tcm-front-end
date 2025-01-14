/** @type {import('next').NextConfig} */

import {withSentryConfig} from "@sentry/nextjs";
import {getRelease} from "./src/helpers/release.esmodule.mjs";
import withBundleAnalyzer from "@next/bundle-analyzer";
import process from "node:process";

process.env.SENTRY_RELEASE = getRelease();
console.info(`Sentry release: ${process.env.SENTRY_RELEASE}`);
const maintenanceMode = process.env.MAINTENANCE_MODE === "true";
console.info(`Maintenance mode: ${maintenanceMode}`);

let nextConfig = {
  logging: {fetches: {fullUrl: true}},
  images: {
    remotePatterns: process.env.IMAGE_REMOTE_PATTERN.split(",").map(
      (pattern) => {
        const [protocol, hostname] = pattern.split("://");
        return {protocol, hostname};
      },
    ),
  },
  ...(maintenanceMode && {
    async redirects() {
      return [
        {
          source: "/((?!maintenance).*)",
          destination: "/maintenance",
          permanent: false,
        },
      ];
    },
  }),
};

nextConfig = withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  org: "fabio-lazzaroni",
  project: "piattaforma-tcm",

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

nextConfig = bundleAnalyzer(nextConfig);

export default nextConfig;
