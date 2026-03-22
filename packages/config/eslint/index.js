const { resolve } = require("node:path");

/** @type {import("eslint").Linter.Config[]} */
module.exports = [
  {
    ignores: ["**/node_modules/**", "**/.next/**", "**/dist/**", "**/.turbo/**"],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      "no-console": "warn",
      "no-unused-vars": "off",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];
