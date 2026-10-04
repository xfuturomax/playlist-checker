import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/", ".wrangler/", "openspec/", ".claude/"] },
  js.configs.recommended,
  {
    rules: {
      "no-var": "error",
      "prefer-const": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-unused-vars": ["error", { args: "none", caughtErrors: "none" }],
      "no-shadow": "error",
    },
  },
  {
    files: ["public/app/**/*.js"],
    languageOptions: { globals: globals.browser },
  },
  {
    files: ["src/**/*.js"],
    languageOptions: { globals: globals.serviceworker },
  },
  {
    files: ["test/**/*.js", "eslint.config.js"],
    languageOptions: { globals: globals.node },
  },
];
