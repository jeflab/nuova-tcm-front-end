/** @type {import('next').NextConfig} */
const nextConfig = {
  logging: {fetches: {fullUrl: true}},
  experimental: {
    instrumentationHook: true,
    typedRoutes: true,
  },
  images: {
    remotePatterns: process.env.IMAGE_REMOTE_PATTERN.split(",").map(
      (pattern) => {
        const [protocol, hostname] = pattern.split("://");
        return {protocol, hostname};
      },
    ),
  },
};
module.exports = nextConfig;

// Injected content via Sentry wizard below

const {withSentryConfig} = require("@sentry/nextjs");
const {getRelease} = require("./src/helpers/releaseCommon.ts");

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  org: "fabio-lazzaroni",
  project: "piattaforma-tcm",
  release: getRelease(),

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

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

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
module.exports = withBundleAnalyzer(module.exports);
