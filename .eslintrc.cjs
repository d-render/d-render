/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  env: {
    node: true
  },
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  rules: {
    'vue/multi-word-component-names': 0,
    '@typescript-eslint/ban-ts-comment': 0,
    'import/extensions': 0,
    'no-unused-vars': 1,
    '@typescript-eslint/no-unused-vars': 1
  },
  parserOptions: {
    ecmaVersion: 2020
  }
}
