// @ts-check

/**
 * @file ESLint configuration file
 */
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import jsdoc from "eslint-plugin-jsdoc";
import react from "eslint-plugin-react";

import globals from "globals";

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    jsdoc.configs["flat/recommended-typescript"],
    react.configs.flat.recommended,
    eslintPluginPrettierRecommended,

    {
        plugins: {
            jsdoc,
            react,
        },
        languageOptions: {
            parserOptions: {
                project: "./tsconfig.json",
                sourceType: "module",
                ecmaVersion: "latest",
                ecmaFeatures: {
                    jsx: true,
                },
            },
            globals: {
                ...globals.browser,
            },
        },
        files: ["src/**/*.ts", "src/**/*.tsx"],
        ignores: ["node_modules", "dist", "test"],
        rules: {
            "prettier/prettier": "warn",

            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/ban-ts-comment": "warn",
            "@typescript-eslint/explicit-function-return-type": "warn",
            "@typescript-eslint/restrict-template-expressions": [
                "warn",
                { allowNumber: true, allowBoolean: true },
            ],
            "@typescript-eslint/consistent-type-exports": "warn",
            "@typescript-eslint/consistent-type-imports": "warn",
            // "@typescript-eslint/naming-convention": "warn",

            // Modify naming-convention to allow PascalCase for React components/variables
            "@typescript-eslint/naming-convention": [
                "warn",
                {
                    selector: "variable",
                    format: ["camelCase", "PascalCase"],
                },
                {
                    selector: "function",
                    format: ["camelCase", "PascalCase"],
                },
                {
                    selector: "typeLike",
                    format: ["PascalCase"],
                },
            ],

            "jsdoc/require-file-overview": 1,
        },
    },
);
