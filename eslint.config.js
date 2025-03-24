// eslint.config.js
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
    js.configs.recommended, // Aturan dasar JavaScript
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            sourceType: "module",
            globals: {
                process: "readonly",
                console: "readonly",
                Buffer: "readonly",
                Express: "readonly",
            },
        },
        plugins: {
            "@typescript-eslint": ts,
        },
        rules: {
            "no-undef": "off", // Tidak perlu lagi karena sudah didefinisikan di globals
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            // "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-this-alias": "warn",
            "no-unused-vars": "warn",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
            ],
        },
        ignores: ["node_modules/", "dist/", "build/"],
    },
];
