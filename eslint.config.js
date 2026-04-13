import angular from "angular-eslint";
import stylistic from "@stylistic/eslint-plugin";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig(
  {
    ignores: [
      "node_modules/**/*",
      "dist/**/*",
      "coverage/**/*",
      "projects/**/*",
      ".angular/**/*",
      ".vscode/**/*",
      "eslint.config.js",
    ],
  },
  {
    files: ["**/*.ts"],
    extends: [...tseslint.configs.recommended, ...angular.configs.tsAll],
    processor: angular.processInlineTemplates,
    plugins: {
      "@stylistic": stylistic,
    },
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2024,
      parserOptions: {
        projectService: true,
        createDefaultProgram: true,
      },
    },
    rules: {
      "@angular-eslint/no-developer-preview": "off",
      "@angular-eslint/prefer-standalone": "error",
      // TODO: Re-enable when ngBootstrap supports signals
      "@angular-eslint/prefer-signals": "off",
      // * END TODO
      "@angular-eslint/prefer-on-push-component-change-detection": "error",
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: ["app", "iqx"],
          style: "kebab-case",
        },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: ["app", "iqx"],
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-class-suffix": [
        "error",
        { suffixes: ["Component"] },
      ],
      "@angular-eslint/directive-class-suffix": [
        "error",
        { suffixes: ["Directive"] },
      ],
      "@typescript-eslint/no-deprecated": "error",
      // "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/require-await": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: [
            "classProperty",
            "typeProperty",
            "classMethod",
            "objectLiteralMethod",
            "typeMethod",
            "accessor",
            "enumMember",
          ],
          format: ["camelCase", "PascalCase"],
        },
        {
          selector: "objectLiteralMethod",
          modifiers: ["requiresQuotes"],
          format: null,
        },
      ],
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          accessibility: "explicit",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/member-ordering": "error",
      "@stylistic/member-delimiter-style": [
        "error",
        {
          multiline: {
            delimiter: "none",
            requireLast: true,
          },
          singleline: {
            delimiter: "semi",
            requireLast: false,
          },
        },
      ],
      "@stylistic/semi": ["error", "never"],
      "@stylistic/block-spacing": "error",
      "@stylistic/space-before-blocks": ["error", "always"],
      "@stylistic/space-in-parens": ["error", "always"],
      "@stylistic/space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "always",
          asyncArrow: "always",
        },
      ],
      "@stylistic/keyword-spacing": [
        "error",
        {
          before: true,
          after: true,
        },
      ],
      "@stylistic/function-call-spacing": ["error", "always"],
      "@stylistic/array-bracket-spacing": ["error", "always"],
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/quotes": [
        "error",
        "double",
        {
          avoidEscape: true,
          allowTemplateLiterals: "always",
        },
      ],
      "@stylistic/indent": [
        "error",
        2,
        {
          SwitchCase: 1,
          FunctionDeclaration: {
            body: 1,
            parameters: "first",
          },
          FunctionExpression: {
            body: 1,
            parameters: "first",
          },
        },
      ],
      "@stylistic/arrow-parens": ["error", "as-needed"],
      "@stylistic/max-len": [
        "error",
        {
          ignorePattern: "^import [^,]+ from |^export | implements",
          code: 150,
          tabWidth: 2,
          comments: 200,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
        },
      ],
      "prefer-arrow-callback": [
        "warn",
        {
          allowNamedFunctions: false,
        },
      ],
      "func-style": ["error", "expression"],
      "no-unused-vars": "off", // Turn standard rule off, use TypeScript version
      "no-unused-labels": "error",
    }
  },
  {
    files: ["**/*.html"],
    extends: [...angular.configs.templateRecommended],
    rules: {}
  }
);