import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

const cypressGlobals = {
  cy: 'readonly',
  Cypress: 'readonly',
  expect: 'readonly',
  assert: 'readonly',
  describe: 'readonly',
  it: 'readonly',
  context: 'readonly',
  before: 'readonly',
  after: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
}

const vitestGlobals = {
  expect: 'readonly',
  describe: 'readonly',
  it: 'readonly',
  vi: 'readonly',
  beforeEach: 'readonly',
  afterEach: 'readonly',
  beforeAll: 'readonly',
  afterAll: 'readonly',
  require: 'readonly',
}

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
  {
    files: ['cypress/**/*.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...cypressGlobals },
    },
  },
  {
    files: ['**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...vitestGlobals },
    },
  },
])
