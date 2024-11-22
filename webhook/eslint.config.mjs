import globals from "globals";
import pluginJs from "@eslint/js";
import jestPlugin from "eslint-plugin-jest";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
    plugins: {
      jest: jestPlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...jestPlugin.configs.recommended.rules,
    },
  },
  {
    files: ["tests/**/*.test.js"], // Target test files specifically
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest, // Add Jest globals (e.g., `describe`, `it`, `expect`)
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }], // Ignore unused args starting with `_`
      "no-console": "off", // Allow `console.log` in tests
      "jest/no-disabled-tests": "warn", // Warn on `.skip`
      "jest/no-focused-tests": "error", // Error on `.only`
      "jest/no-identical-title": "error", // Prevent duplicate test titles
      "jest/valid-expect": "error", // Ensure valid `expect` usage
    },
  },
];
