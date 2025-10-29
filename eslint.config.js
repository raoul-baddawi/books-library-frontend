import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import pluginQuery from '@tanstack/eslint-plugin-query'
import pluginRouter from '@tanstack/eslint-plugin-router'

export default tseslint.config(
  { ignores: ['dist', 'node_modules', 'build'] },

  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...pluginQuery.configs['flat/recommended'],
      ...pluginRouter.configs['flat/recommended'],
    ],

    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
      '@tanstack/query': pluginQuery,
      '@tanstack/router': pluginRouter,
    },

    rules: {
      // ✅ Core React & Hooks
      ...reactHooks.configs.recommended.rules,
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'off', // disable over-aggressive rule
      'react-hooks/refs': 'off', // ignore “Cannot access refs during render”
      'react-hooks/immutability': 'off', // ignore order-of-declaration warnings
      'react-hooks/incompatible-library': 'off', // tanstack warning

      // ✅ TypeScript & Imports
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { varsIgnorePattern: '^_', argsIgnorePattern: '^_' },
      ],
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': 'off',

      // ✅ Imports sorting
      'simple-import-sort/imports': 'warn',
      'simple-import-sort/exports': 'warn',

      // ✅ React Fast Refresh rule (dev only)
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // ✅ Other general noise reducers
      'no-console': 'off',
      'no-debugger': 'off',
      'no-undef': 'off',
      'no-restricted-globals': 'off',
    },
  },
)
