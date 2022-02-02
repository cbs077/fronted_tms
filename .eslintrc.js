module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:unicorn/recommended",
    "plugin:sonarjs/recommended",
    "plugin:import/typescript",
    "plugin:prettier/recommended",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint", "simple-import-sort", "unicorn", "sonarjs", "import", "prettier"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "import/first": "error",
    "import/newline-after-import": "error",
    "import/no-duplicates": "error",
    "unicorn/filename-case": "off",
    "vue/multi-word-component-names": "off",
    "unicorn/consistent-function-scoping": "off",
  },
  ignorePatterns: ["*.config.js", ".eslintrc.js", ".prettierrc"],
};
