import globals from "globals";
import pluginJs from "@eslint/js";
import { configs as tsEslintConfigs } from "@typescript-eslint/eslint-plugin";
import { configs as tsParserConfigs } from "@typescript-eslint/parser";
import pluginReact from "eslint-plugin-react";

export default {
  parserOptions: {
    project: "./tsconfig.json",
  },
  files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  languageOptions: {
    globals: globals.browser,
  },
  extends: [
    pluginJs.configs.recommended,
    tsEslintConfigs.recommended,
    pluginReact.configs.recommended,
  ],
  rules: {
    "react/react-in-jsx-scope": "off",
    // other custom rules
  },
};
