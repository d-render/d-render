/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  env: {
    node: true
  },
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/eslint-config-standard'
  ],
  rules: {
    'vue/multi-word-component-names': 0,
    'import/extensions': 0
  },
  parserOptions: {
    ecmaVersion: 12
  }
}
