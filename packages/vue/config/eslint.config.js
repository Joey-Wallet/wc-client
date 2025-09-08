import tseslint from 'typescript-eslint';
import stylisticJs from '@stylistic/eslint-plugin-js';
import pluginImport from 'eslint-plugin-import-x';
import pluginNode from 'eslint-plugin-n';
import pluginVue from 'eslint-plugin-vue';
import globals from 'globals';

import prettierConfig from './prettier.config.js';

import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  ...pluginVue.configs['flat/essential'],
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
  {
    name: 'ignores',
    ignores: ['**/node_modules', '**/dist', '**/build', '**/coverage', '**/.nx/**', '**/config/**'],
  },
  {
    name: 'setup',
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      sourceType: 'module',
      ecmaVersion: 2020,
      parser: tseslint.parser,
      parserOptions: {
        project: true,
        parser: tseslint.parser,
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      '@stylistic/js': stylisticJs,
      '@typescript-eslint': tseslint.plugin,
      import: pluginImport,
      node: pluginNode,
      vue: pluginVue,
    },
    rules: {
      'prettier/prettier': ['warn', prettierConfig],
      '@stylistic/js/spaced-comment': 'error',
      /** Prevent @ts-ignore, allow @ts-expect-error */
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-expect-error': false,
          'ts-ignore': 'allow-with-description',
        },
      ],
      /** Enforce import type { T } */
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      /** Shorthand method style is less strict */
      '@typescript-eslint/method-signature-style': ['error', 'property'],
      /** Enforces generic type convention */
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeParameter',
          format: ['PascalCase'],
          leadingUnderscore: 'forbid',
          trailingUnderscore: 'forbid',
          custom: {
            regex: '^(T|T[A-Z][A-Za-z]+)$',
            match: true,
          },
        },
      ],
      /** Duplicate values can lead to bugs that are hard to track down */
      '@typescript-eslint/no-duplicate-enum-values': 'error',
      /** Using the operator any more than once does nothing */
      '@typescript-eslint/no-extra-non-null-assertion': 'error',
      /** There are several potential bugs with this compared to other loops */
      '@typescript-eslint/no-for-in-array': 'error',
      /** Don't over-define types for simple things like strings */
      '@typescript-eslint/no-inferrable-types': ['error', { ignoreParameters: true }],
      /** Enforce valid definition of new and constructor */
      '@typescript-eslint/no-misused-new': 'error',
      /** Disallow TypeScript namespaces */
      '@typescript-eslint/no-namespace': 'error',
      /** Disallow non-null assertions after an optional chain expression */
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
      /** Detects conditionals which will always evaluate truthy or falsy */
      '@typescript-eslint/no-unnecessary-condition': 'error',
      /** Checks if the the explicit type is identical to the inferred type */
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      /** Disallow using the unsafe built-in Function type */
      '@typescript-eslint/no-unsafe-function-type': 'error',
      /** Disallow using confusing built-in primitive class wrappers */
      '@typescript-eslint/no-wrapper-object-types': 'error',
      /** Enforce the use of as const over literal type */
      '@typescript-eslint/prefer-as-const': 'error',
      /** Prefer for-of loop over the standard for loop */
      '@typescript-eslint/prefer-for-of': 'warn',
      /** Warn about async functions which have no await expression */
      '@typescript-eslint/require-await': 'warn',
      /** Prefer of ES6-style import declarations */
      '@typescript-eslint/triple-slash-reference': 'error',
      /** Bans the use of inline type-only markers for named imports */
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      /** Reports any imports that come after non-import statements */
      'import/first': 'error',

      /** Stylistic preference */
      'import/newline-after-import': 'error',
      /** No require() or module.exports */
      'import/no-commonjs': 'error',
      /** No import loops */
      'import/no-cycle': 'error',
      /** Reports if a resolved path is imported more than once */
      'import/no-duplicates': 'error',
      /** Stylistic preference */
      'import/order': [
        'error',
        {
          groups: [
            'external',
            'internal',
            'builtin',
            'parent',
            'sibling',
            'index',
            'object',
            'type',
          ],
        },
      ],

      'for-direction': 'error',
      'no-async-promise-executor': 'error',
      'no-case-declarations': 'error',
      'no-class-assign': 'error',
      'no-compare-neg-zero': 'error',
      'no-cond-assign': 'error',
      'no-constant-binary-expression': 'error',
      'no-constant-condition': 'error',
      'no-control-regex': 'error',
      'no-debugger': 'error',
      'no-delete-var': 'error',
      'no-dupe-else-if': 'error',
      'no-duplicate-case': 'error',
      'no-empty-character-class': 'error',
      'no-empty-pattern': 'error',
      'no-empty-static-block': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      'no-fallthrough': 'error',
      'no-global-assign': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-loss-of-precision': 'error',
      'no-misleading-character-class': 'error',
      'no-nonoctal-decimal-escape': 'error',
      'no-octal': 'error',
      'no-regex-spaces': 'error',
      'no-self-assign': 'error',
      /** Warn about variable with identical names in the outer scope */
      'no-shadow': 'warn',
      'no-shadow-restricted-names': 'error',
      'no-sparse-arrays': 'error',
      'no-unsafe-finally': 'error',
      'no-unsafe-optional-chaining': 'error',
      'no-unused-labels': 'error',
      'no-unused-private-class-members': 'error',
      'no-useless-backreference': 'error',
      'no-useless-catch': 'error',
      'no-useless-escape': 'error',
      /** Prefer let and const */
      'no-var': 'error',
      'no-with': 'error',
      /** Prefer const if never re-assigned */
      'prefer-const': 'error',
      'require-yield': 'error',
      /** Stylistic consistency */
      'sort-imports': ['error', { ignoreDeclarationSort: true }],
      'use-isnan': 'error',
      /** Enforce comparing typeof against valid strings */
      'valid-typeof': 'error',
    },
  },
];
