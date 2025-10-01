import {dirname} from "path";
import {fileURLToPath} from "url";
import {FlatCompat} from "@eslint/eslintrc";
import pluginQuery from "@tanstack/eslint-plugin-query";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  ...pluginQuery.configs["flat/recommended"],
  ...compat.config({
    extends: [
      //    "eslint:recommended",
      //    "plugin:@typescript-eslint/recommended-type-checked",
      //    "plugin:@typescript-eslint/stylistic-type-checked",
      //    "plugin:@typescript-eslint/strict-type-checked",
      "next/core-web-vitals",
      "next/typescript",
      "prettier",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      project: true,
    },
    plugins: ["@typescript-eslint", "eslint-plugin-react-compiler"],
    root: true,
    rules: {
      "react-compiler/react-compiler": "error",
      "react/no-unescaped-entities": [
        "error",
        {
          forbid: [
            {
              char: ">",
              alternatives: ["&gt;"],
            },
            {
              char: '"',
              alternatives: ["&quot;", "&ldquo;", "&#34;", "&rdquo;"],
            },
            {
              char: "}",
              alternatives: ["&#125;"],
            },
          ],
        },
      ],
    },
  }),
];

export default eslintConfig;
