module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"]
  },
  plugins: [
    "@typescript-eslint"
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier/@typescript-eslint",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ],
  rules: {
    // "@typescript-eslint/explicit-function-return-type": ["off"],
    "forin": ["off"],
    "semi": ["warn"],
    "@typescript-eslint/interface-name-prefix": ["off"],
    "@typescript-eslint/no-use-before-define": ["error", {"functions": false, "classes": false}],
    "no-console": ["off"]
  }

};

