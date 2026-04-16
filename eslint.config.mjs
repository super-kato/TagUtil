import { defineConfig } from 'eslint/config';
import tseslint from '@electron-toolkit/eslint-config-ts';
import eslintConfigPrettier from '@electron-toolkit/eslint-config-prettier';
import eslintPluginSvelte from 'eslint-plugin-svelte';

export default defineConfig(
  { ignores: ['**/node_modules', '**/dist', '**/out'] },
  tseslint.configs.recommended,
  eslintPluginSvelte.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    files: ['src/**/*.svelte'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser
      }
    }
  },
  {
    files: ['src/**/*.{ts,tsx,svelte.ts}'],
    languageOptions: {
      parser: tseslint.parser
    }
  },
  {
    files: ['src/**/*.{ts,tsx,svelte,svelte.ts}'],
    rules: {
      'svelte/no-unused-svelte-ignore': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'func-style': ['error', 'expression'],
      'prefer-arrow-callback': 'error',
      'no-unused-expressions': 'error',
      'no-nested-ternary': 'error',
      eqeqeq: ['error', 'always'],
      '@typescript-eslint/no-magic-numbers': [
        'error',
        {
          ignore: [0, 1],
          ignoreArrayIndexes: true,
          ignoreEnums: true,
          ignoreNumericLiteralTypes: true,
          ignoreReadonlyClassProperties: true
        }
      ],
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE']
        },
        {
          selector: 'function',
          format: ['camelCase']
        },
        {
          selector: 'property',
          format: ['camelCase', 'UPPER_CASE']
        },
        {
          selector: 'typeLike',
          format: ['PascalCase']
        },
        {
          selector: 'enumMember',
          format: ['UPPER_CASE']
        },
        {
          selector: 'parameter',
          format: ['camelCase'],
          leadingUnderscore: 'allow'
        }
      ],
      curly: ['error', 'all']
    }
  },
  {
    files: ['**/*.test.ts', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-magic-numbers': 'off'
    }
  }
);
