/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  cacheDirectory: "./node_modules/.cache/remix",
  ignoredRouteFiles: [".*", "**/*.css", "**/*.test.{js,jsx,ts,tsx}"],
  sourcemap: true,
  devServerPort: 8003,
  serverDependenciesToBundle: [
    /^nanoid.*/,
  ]
};
