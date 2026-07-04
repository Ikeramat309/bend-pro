// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: [
      'dist/**',
      '.expo/**',
      'node_modules/**',
      'web-build/**',
      'src/calculators/**',
      // IDE preview artifact — an undeletable reparse point that breaks the glob walk.
      'scripts/__preview__/**',
      // Local visual-debug scratch folder (gitignored; may linger delete-pending on Windows).
      '.debug/**',
    ],
  },
]);
