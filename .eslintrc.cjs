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
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
