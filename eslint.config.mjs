import stylistic from "@stylistic/eslint-plugin"
import tseslint from "typescript-eslint"
import angular from "angular-eslint"

export default tseslint.config (
  {
    ignores: [
      "node_modules/**/*",
      "dist-demo/**/*",
      "coverage/**/*",
      "ios/**/*",
      "android/**/*",
      ".angular/**/*",
      ".vscode/**/*",
    ],
  },
  {
    plugins: {
      "@stylistic": stylistic,
    },
    files: [ "**/*.ts" ],
    extends: [ ...tseslint.configs.recommended, ...angular.configs.tsAll ],
    processor: angular.processInlineTemplates,
    languageOptions: {
      sourceType: "module",
      ecmaVersion: 2024,
      parserOptions: {
        project: [ "./tsconfig.eslint.json" ],
        createDefaultProgram: true,
      },
    },
    rules: {
      "@angular-eslint/no-developer-preview": "off",
      "@angular-eslint/prefer-standalone": "error",
      "@angular-eslint/prefer-signals": "off",
      "@angular-eslint/prefer-on-push-component-change-detection": "error",
      "@angular-eslint/inject-at-top": "off",
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: [ "app" ],
          style: "kebab-case",
        },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: [ "app", "toast" ],
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-class-suffix": [
        "error",
        { suffixes: [ "Component", "Toast" ] },
      ],
      "@angular-eslint/directive-class-suffix": [
        "error",
        { suffixes: [ "Directive" ] },
      ],
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
          format: [ "camelCase", "PascalCase" ],
          leadingUnderscore: "allow",
        },
        {
          selector: "objectLiteralMethod",
          modifiers: [ "requiresQuotes" ],
          format: null,
        },
      ],
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        { accessibility: "explicit" },
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
          multiline: { delimiter: "none", requireLast: true },
          singleline: { delimiter: "semi", requireLast: false },
        },
      ],
      "@stylistic/semi": [ "error", "never" ],
      "@stylistic/block-spacing": "error",
      "@stylistic/space-before-blocks": [ "error", "always" ],
      "@stylistic/space-in-parens": [ "error", "always" ],
      "@stylistic/space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "always",
          asyncArrow: "always",
        },
      ],
      "@stylistic/keyword-spacing": [ "error", { before: true, after: true } ],
      "@stylistic/function-call-spacing": [ "error", "always" ],
      "@stylistic/array-bracket-spacing": [ "error", "always" ],
      "@stylistic/object-curly-spacing": [ "error", "always" ],
      "@stylistic/quotes": [
        "error",
        "double",
        { avoidEscape: true, allowTemplateLiterals: "always" },
      ],
      "@stylistic/indent": [
        "error",
        2,
        {
          SwitchCase: 1,
          FunctionDeclaration: { body: 1, parameters: "first" },
          FunctionExpression: { body: 1, parameters: "first" },
        },
      ],
      "@stylistic/arrow-parens": [ "error", "as-needed" ],
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
      "prefer-arrow-callback": [ "warn", { allowNamedFunctions: false } ],
      "func-style": [ "error", "expression" ],
      "no-unused-vars": "off",
      "no-unused-labels": "error",
    },
  },
  {
    files: [ "projects/ngx-toastr/**/*.ts" ],
    rules: {
      "@angular-eslint/prefer-standalone": "off",
      "@angular-eslint/component-selector": "off",
      "@angular-eslint/directive-selector": "off",
      "@angular-eslint/prefer-host-metadata-property": "off",
      "@angular-eslint/component-class-suffix": "off",
      "@angular-eslint/prefer-service-decorator": "off",
      "@typescript-eslint/member-ordering": "off",
      "@typescript-eslint/explicit-member-accessibility": "off",
    },
  },
  {
    files: [ "projects/demo/src/app/**/*.ts" ],
    rules: {
      "@angular-eslint/component-max-inline-declarations": "off",
      "@angular-eslint/component-selector": "off",
      "@typescript-eslint/member-ordering": "off",
    },
  },
  {
    files: [ "**/*.spec.ts" ],
    rules: {
      "@typescript-eslint/explicit-member-accessibility": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: [ "**/*.html" ],
    extends: [ ...angular.configs.templateRecommended ],
    rules: {
      "@angular-eslint/template/prefer-self-closing-tags": "warn",
      "@angular-eslint/template/prefer-control-flow": "warn",
      "@angular-eslint/template/no-inline-styles": "off",
    },
  },
)
